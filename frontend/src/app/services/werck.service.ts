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
	constructor(protected backend: BackendService, protected log: LogService, protected fileService: FileService) {
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

	ppq(): Promise<Ticks> {
		return this.backend.appGetConfig().then(x => x.ppq);
	}

	async handleWerckChanged() {
		this.handleErrors(this.mainSheet);
		this.handleWarnings(this.mainSheet);
		await this.updateDocumentFiles();
		await this.updateInstruments();
		this.werckChanged.emit();
	}

	async update() {
		await this.backend.werckUpdate(this.mainSheet);
		this.handleWerckChanged();
	}

	async fileChanged(file: IFile) {
		let isSheetFile = file.extension === AppConfig.knownExtensions.sheet
			|| file.extension === AppConfig.knownExtensions.tutorial;
		if (file.isNew && isSheetFile) {
			await this.openSheet(file.path);
			return;
		}
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

	async updateDocumentFiles() {
		let newDocumentFiles = await this.backend.werckGetSheetFiles();
		newDocumentFiles = _(newDocumentFiles)
			.filter(x => x.sourceId !== this.mainSheet.sourceId)
			.value();
		newDocumentFiles = _.concat(this.mainSheet, newDocumentFiles);
		this.merge_(newDocumentFiles, this.documentFiles)
	}

	async closeSheet() {
		if (this.isPlaying) {
			await this.stop();
		}
		this.backend.werckCloseSheet();
		this.documentFiles.splice(0, this.documentFiles.length);
		this.onCloseSheet.emit(this.mainSheet);
	}

	async createNewSheet(): Promise<IFile> {
		if (!!this.mainSheet) {
			await this.closeSheet();
		}
		this.mainSheet = await this.backend.werckCreateNewSheet();
		this.sheetChanged.emit(this.mainSheet);
		this.instruments = [];
		this.documentFiles = [];
		this.totalDuration = 0;
		this.werckChanged.emit();
		return this.mainSheet;
	}

	private async updateInstruments() {
		let newInstruments = await this.backend.werckGetInstruments();
		newInstruments = newInstruments.filter(x => !!x).sort((a, b) => a.name.localeCompare(b.name));
		this.instruments.splice(0, this.instruments.length);
		for(let instrument of newInstruments) {
			this.instruments.push( instrument );
		}
	}

	private async _openSheetImpl(path: Path, sf: _SheetFileCreator): Promise<IFile> {
		this.log.info(`open: ${path} `);
		try {
			if (!!this.mainSheet) {
				await this.closeSheet();
			}
			this.mainSheet = await sf(path);
			this.sheetChanged.emit(this.mainSheet);
		} catch (ex) {
			throw ex;
		}
		await this.handleWerckChanged();
		return this.mainSheet;
	}

	openSheet(path): Promise<IFile> {
		return this._openSheetImpl(path, this.backend.werckOpenSheet.bind(this.backend));
	}

	async createTutorialFile(text: string): Promise<IFile> {
		return await this.backend.appCreateVirtualSheet(text);
	}

	async setSheet(file: IFile) {
		if (!!this.mainSheet) {
			let isSheetType = this.mainSheet.extension === AppConfig.knownExtensions.sheet;
			if (isSheetType) {
				await this.closeSheet();
			}
		}
		this.mainSheet = await this.backend.werckOpenSheet(file.path);
		await this.handleWerckChanged();
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

	getEvents(file: IFile) {
		return this.backend.werckGetEvents(file.sourceId);
	}

	getEventsAt(position: Ticks) {
		return this.backend.werckGetEventsAt(position);
	}

	getEventsAtCurrentTime() {
		return this.currentEvents;
	}


	checkAutoStop() {
		if (this.position >= this.totalDuration) {
			setTimeout(this.stop.bind(this));
		}
	}

	async updatePosition() {
		let posres = await this.backend.werckGetCurrentPosition();
		let newPosition = Math.min(posres.quarters, this.totalDuration);
		if (newPosition !== this.position) {
			this.positionChange.emit(newPosition);
			this.currentEvents = await this.backend.werckGetEventsAtCurrentTime();
		}
		this.position = newPosition;
		this.checkAutoStop();
	}

	startPositionPolling() {
		// if (this.pollerId) {
		// 	return;
		// }
		// this.pollerId = setInterval(this.updatePosition.bind(this), AppConfig.WerckPositionPollingMillis);
	}

	stopPositionPolling() {
		// if (!this.pollerId) {
		// 	return;
		// }
		// clearInterval(this.pollerId);
		// this.pollerId = null;
	}

	async updateTotalDuration() {
		let response = await this.backend.werckGetTotalDuration();
		this.totalDuration = response.quarters;
	}

	async play() {
		if (this.mainSheet.isNew) {
			this.onTryPlayWithoutSheet.emit();
			return;
		}
		if (this.isPlaying) {
			return;
		}
		let ppq = await this.ppq();
		let startPosition = this.startPosition;
		if (this.isPaused) {
			startPosition = this.position;
		}
		this.playerState = PlayerState.Playing;
		this.backend.werckPlay(startPosition * ppq);
		this.updateTotalDuration().then(() => {
			this.startPositionPolling();
		});
	}

	async stop() {
		if (this.isStopped) {
			return;
		}
		this.playerState = PlayerState.Stopped;
		this.stopPositionPolling();
		await this.backend.werckStop();
		setTimeout(()=>{
			this.position = 0;
		}, 100);
	}
	async pause() {
		if (this.isPaused) {
			return;
		}
		this.playerState = PlayerState.Paused;
		this.stopPositionPolling();
		await this.backend.werckStop();
	}
}
