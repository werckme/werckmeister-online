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



type _SheetFileCreator = (path: string) => Promise<ISheetFile>;

export type PlayerStateChange = { from: PlayerState, to: PlayerState };

@Injectable({
	providedIn: 'root'
})
export class WerckService {
	//isPlaying: boolean;
	private playerState_: PlayerState = PlayerState.Stopped;
	pollerId: any;
	position: Quarters = 0;
	totalDuration = 0;
	private startPosition_: Quarters = 0;
	mainSheet: ISheetFile;
	documentFiles: IFile[] = [];
	instruments: IInstrument[] = [];
	currentEvents: IEventInfo[] = [];
	werckChanged = new EventEmitter<void>();
	positionChange = new EventEmitter<Quarters>();
	playerStateChange = new EventEmitter<PlayerStateChange>();
	sheetChanged = new EventEmitter<ISheetFile>();
	onTryPlayWithoutSheet = new EventEmitter<void>();
	onCloseSheet = new EventEmitter<IFile>();
	constructor(protected backend: BackendService, protected log: LogService, protected fileService: FileService, protected rest: RestService) {
		this.fileService.fileSaved.subscribe({next: this.onFileSaved.bind(this)});
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
		let oldState = this.playerState_;
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
		let toRemove = _(destination).differenceBy(newFiles, x => x.sourceId).value();
		let toAdd = _(newFiles).differenceBy(destination, x => x.sourceId).value();
		_.pullAll(this.documentFiles, toRemove);
		for (let x of toAdd) {
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



	handleErrors(mainSheet: ISheetFile): any {
		if (mainSheet.hasError) {
			this.log.error(mainSheet.error);
		}
	}

	handleWarnings(mainSheet: ISheetFile): any {
		if (mainSheet.hasWarnings) {
			for (let warning of mainSheet.warnings) {
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



	async play() {
		console.log(this.mainSheet);
		this.rest.compile();
		// if (this.mainSheet.isNew) {
		// 	this.onTryPlayWithoutSheet.emit();
		// 	return;
		// }
		// if (this.isPlaying) {
		// 	return;
		// }
		// let startPosition = this.startPosition;
		// if (this.isPaused) {
		// 	startPosition = this.position;
		// }
		// this.playerState = PlayerState.Playing;
	}

	async stop() {
		if (this.isStopped) {
			return;
		}
		this.playerState = PlayerState.Stopped;
		setTimeout(()=>{
			this.position = 0;
		}, 100);
	}
	async pause() {
		if (this.isPaused) {
			return;
		}
		this.playerState = PlayerState.Paused;
	}
}
