import { Injectable, EventEmitter } from '@angular/core';
import { Ticks, Quarters, Path } from 'src/shared/werck/types';
import { BackendService } from './backend.service';
import { AFile, IFile, ISheetFile, ICompiledSheetFile, IEventInfo, ISheetEventInfo } from 'src/shared/io/file';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { IEventLocation } from 'src/shared/editor/EventLocation';
import { PlayerState } from 'src/shared/werck/player';
import { IInstrument } from 'src/shared/werck/instrument';
import { LogService } from './log.service';
import { FileService } from './file.service';
import { MidiplayerService, IMidiplayerEvent } from './midiplayer.service';
import { EventType } from 'src/shared/midi/midiEvent';
import * as uuid from 'uuid-random';
import { waitAsync } from 'src/shared/help/waitAsync';
import { WerckmeisterjsService } from './werckmeisterjs.service';
import { TextFileContent } from 'src/shared/io/fileContent';

type _SheetFileCreator = (path: string) => Promise<ISheetFile>;

export interface PlayerStateChange { from: PlayerState; to: PlayerState; }

@Injectable({
	providedIn: 'root'
})
export class WerckService {
	private playerState_: PlayerState = PlayerState.Stopped;
	pollerId: any;
	totalDuration = 0;
	private startPosition_: Quarters = 0;
	mainSheet: ICompiledSheetFile;
	documentFiles: IFile[] = [];
	instruments: IInstrument[] = [];
	werckChanged = new EventEmitter<void>();
	noteOnChange = new EventEmitter<Quarters>();
	playerStateChange = new EventEmitter<PlayerStateChange>();
	sheetChanged = new EventEmitter<ISheetFile>();
	onCloseSheet = new EventEmitter<IFile>();
	constructor(protected backend: BackendService, 
		           protected log: LogService, 
		           protected fileService: FileService, 
				   protected werckmeisterJs: WerckmeisterjsService,
		           protected midiPlayer: MidiplayerService) {
		this.midiPlayer.onEOF.subscribe({next: this.onWerckEof.bind(this)});
		this.midiPlayer.onMidiEvent.subscribe({next: this.onMidiEvent.bind(this)});
	}

	onWerckEof() {
		this.stop();
	}
	
	onMidiEvent(ev: IMidiplayerEvent) {
		if (ev.midiEvent.eventType === EventType.NoteOn) {
			this.noteOnChange.emit(ev.position);
		}
	}
	
	get playerState(): PlayerState {
		return this.playerState_;
	}

	set playerState(val: PlayerState) {
		const oldState = this.playerState_;
		this.playerState_ = val;
		this.playerStateChange.emit({ from: oldState, to: val });
	}

	get isPlaying(): boolean {
		return this.playerState === PlayerState.Playing;
	}
	get isStopped(): boolean {
		return this.playerState === PlayerState.Stopped;
	}
	get isPaused(): boolean {
		return this.playerState === PlayerState.Paused;
	}

	get startPosition(): Ticks {
		return this.startPosition_;
	}
	set startPosition(val: Ticks) {
		if (val > this.totalDuration) {
			return;
		}
		this.startPosition_ = val;
	}

	get time(): Quarters {
		if (this.isStopped || !this.midiPlayer) {
			return 0;
		}
		return this.midiPlayer.position;
	}


	private fileToRequestFiles(file: IFile) {
		if (!file) {
			return null;
		}
		if (file.extension === AppConfig.knownExtensions.tutorial) {
			file.extension = AppConfig.knownExtensions.sheet;
		}
		return {path: file.filename, data: (file.content as TextFileContent).data};
	}

	private async compile(files: IFile[]): Promise<ICompiledSheetFile> {
		const requestFiles: any = _(files)
			.map((file: IFile) => this.fileToRequestFiles(file))
			.filter( x => !!x )
			.value()
		;
		const sheet: any = _(files).filter(x => x.extension === '.sheet').first();
		const response: any = await this.werckmeisterJs.compile(requestFiles);
		sheet.eventInfos = response.eventInfos;
		sheet.warnings = response.midi.warnings;
		sheet.midi = {
			bpm: response.midi.bpm,
			duration: response.midi.duration,
			midiData: response.midi.midiData
		};
		sheet.sources = response.midi.sources;
		return sheet as ICompiledSheetFile;
	}

	async setSheet(file: IFile) {
		this.mainSheet = await this.compile([file]);
	}

	get hasError(): boolean {
		return !!this.mainSheet && this.mainSheet.hasError;
	}

	private merge_(newFiles: IFile[], destination: IFile[]) {
		const toRemove = _(destination).differenceBy(newFiles, x => x.sourceId).value();
		const toAdd = _(newFiles).differenceBy(destination, x => x.sourceId).value();
		_.pullAll(this.documentFiles, toRemove);
		for (const x of toAdd) {
			this.documentFiles.push(x);
		}
	}

	async createTutorialFile(text: string, filename: string = "unknown.sheet"): Promise<IFile> {
		const file = await this.backend.appCreateVirtualSheet(text, filename);
		file.sourceId = uuid();
		return file;
	}

	async createSnippetFile(text: string, filename: string): Promise<IFile> {
		const result =  await this.backend.appCreateVirtualSheet(text, filename);
		result.extension = '.sheet';
		result.sourceId = uuid();
		return result;
	}	

	handleErrors(mainSheet: ISheetFile): any {
		if (mainSheet.hasError) {
			this.log.error(mainSheet.error);
		}
	}

	handleWarnings(mainSheet: ISheetFile): any {
		if (mainSheet.hasWarnings) {
			for (const warning of mainSheet.warnings) {
				this.log.warn(warning);
			}
		}
	}


	getEventsAtCurrentTime(): IEventInfo {
		if (!this.mainSheet) {
			return null;
		}
		const treffer = _(this.mainSheet.eventInfos)
			.map((x:IEventInfo) => ({diff: Math.abs(this.time - x.sheetTime), eventInfo: x}))
			.minBy(x => x.diff);
		if (!treffer) {
			return null;
		}
		return treffer.eventInfo;
	}

	getEvents(file: IFile): IEventInfo[] {
		if (!this.mainSheet) {
			return [];
		}
		return this.mainSheet.eventInfos;
	}

	checkAutoStop() {
		if (this.time >= this.totalDuration) {
			setTimeout(this.stop.bind(this));
		}
	}

	/**
	 * 
	 * @param browser policies require to do audio context initialization during
	 * an user event. Thats why we force to have a event arg.
	 */
	async play(event: MouseEvent | KeyboardEvent) {
		if (this.isPlaying) {
			await this.stop();
		}
		if (!this.mainSheet) {
			return;
		}
		let startPosition = this.startPosition;
		if (this.isPaused) {
			startPosition = this.time;
		}
		this.playerState = PlayerState.Playing;
		this.midiPlayer.tempo = this.mainSheet.midi.bpm;
		await this.midiPlayer.play(this.mainSheet.midi.midiData, event);
	}

	async stop() {
		if (this.isStopped) {
			return;
		}
		this.playerState = PlayerState.Stopped;
		this.midiPlayer.stop();
		await waitAsync(500);
	}
	async pause() {
		if (this.isPaused) {
			return;
		}
		this.playerState = PlayerState.Paused;
	}
}
