import { Injectable, EventEmitter } from '@angular/core';
import { Ticks, Quarters, Path } from 'src/shared/werck/types';
import { BackendService } from './backend.service';
import { AFile, IFile, ISheetFile } from 'src/shared/io/file';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { IEventInfo } from 'src/shared/editor/EventLocation';
import { PlayerState } from 'src/shared/werck/player';
import { IInstrument } from 'src/shared/werck/instrument';
import { LogService } from './log.service';
import { FileService } from './file.service';
import { RestService } from './rest.service';
import { MidiplayerService, IMidiplayerEvent } from './midiplayer.service';
import { EventType } from 'src/shared/midi/midiEvent';


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
	mainSheet: ISheetFile;
	documentFiles: IFile[] = [];
	instruments: IInstrument[] = [];
	currentEvents: IEventInfo[] = [];
	werckChanged = new EventEmitter<void>();
	noteOnChange = new EventEmitter<Quarters>();
	playerStateChange = new EventEmitter<PlayerStateChange>();
	sheetChanged = new EventEmitter<ISheetFile>();
	onCloseSheet = new EventEmitter<IFile>();
	constructor(protected backend: BackendService, 
		           protected log: LogService, 
		           protected fileService: FileService, 
		           protected rest: RestService,
		           protected midiPlayer: MidiplayerService) {
		this.fileService.fileSaved.subscribe({next: this.onFileSaved.bind(this)});
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

	getFilesOfType(extensions: string[]): IFile[] {
		if (!this.documentFiles) {
			return [];
		}
		return this.documentFiles.filter(x => extensions.indexOf(x.extension) >= 0);
	}

	get sheetFiles(): IFile[] {
		return this.getFilesOfType([AppConfig.knownExtensions.sheet]);
	}

	get templateFiles(): IFile[] {
		return this.getFilesOfType([AppConfig.knownExtensions.template]);
	}

	get miscFiles(): IFile[] {
		return this.getFilesOfType([AppConfig.knownExtensions.chordDef,
			AppConfig.knownExtensions.pitchmap,
			AppConfig.knownExtensions.lua
		]);
	}
	
	get defaultInstrument(): IInstrument {
		if (!this.instruments || this.instruments.length === 0) {
			return undefined;
		}
		return this.instruments[0];
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

	get position(): Quarters {
		if (this.isStopped || !this.midiPlayer) {
			return 0;
		}
		return this.midiPlayer.position;
	}

	setSheet(file: IFile) {
		this.mainSheet = file as ISheetFile;
	}

	async update() {
		
	}

	async fileChanged(file: IFile) {
		return await this.update();
	}

	async onFileSaved(file: IFile): Promise<void> {
		await this.fileChanged(file);
		file.content.changed = false;
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


	async closeSheet() {
		if (this.isPlaying) {
			await this.stop();
		}
	}

	async createTutorialFile(text: string): Promise<IFile> {
		return await this.backend.appCreateVirtualSheet(text);
	}

	async createSnippetFile(text: string): Promise<IFile> {
		const result =  await this.backend.appCreateVirtualSheet(text);
		result.extension = '.sheet';
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


	getEventsAtCurrentTime() {
		return this.currentEvents;
	}


	checkAutoStop() {
		if (this.position >= this.totalDuration) {
			setTimeout(this.stop.bind(this));
		}
	}


	/**
	 * 
	 * @param new brower policies require to do audio context initialization during
	 * an user event. Thats why we force to have a event arg.
	 */
	async play(event: MouseEvent | KeyboardEvent) {
		let startPosition = this.startPosition;
		if (this.isPaused) {
			startPosition = this.position;
		}
		this.playerState = PlayerState.Playing;
		const result: any = await this.rest.compile([this.mainSheet]);
		this.midiPlayer.tempo = result.midi.bpm;
		this.midiPlayer.play(result.midi.midiData, event);
	}

	async stop() {
		if (this.isStopped) {
			return;
		}
		this.playerState = PlayerState.Stopped;
	}
	async pause() {
		if (this.isPaused) {
			return;
		}
		this.playerState = PlayerState.Paused;
	}
}
