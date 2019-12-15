import { Injectable } from '@angular/core';
import { IFile, AFile, ITextFileContent, strToArrayBuffer, ISheetFile, UndefinedSourceId, FileType, ExtensionMap } from 'src/shared/io/file';
import { IEventInfo } from 'src/shared/editor/EventLocation';
import { DocumentSourceId, Quarters, Path, Ticks } from 'src/shared/werck/types';
import * as _ from 'lodash';
import { TextFileContent, BinaryFileContent } from 'src/shared/io/fileContent';
import { AppConfig } from 'src/config';
import { ILogger } from 'src/shared/io/logger';
import { IInstrument } from 'src/shared/werck/instrument';
import { MidiEvent } from 'src/shared/midi/midiEvent';
import { FileDialogOptions } from 'src/shared/io/fileDialog';
import { TmplNewSheet, TmplSheetTemplate, TmplChordDef, TmplPitchmap } from 'src/shared/werck/fileTemplates';

export type AppLeitungRemoteCall = (action: string, args: {}, callback: Function) => any;
export type AppPromise = Promise<any>;
export type AnyAppTransferObject = any;

interface FileResponse extends IFile {
	data: string;
}

interface ValueResult<T> {
	value: T;
}

interface BooleanResponse extends ValueResult<boolean>  {
}

export interface MidiDeviceInfo {
	name: string;
	id: string;
}

export interface MidiDevicesResult {
	outputs: MidiDeviceInfo[];
}

export interface ConfigResult {
	version: string;
	ppq: number;
}

export interface ArgvResult {
	argv: string[];
}

export interface EventsResult {
	events: IEventInfo[];
}

export interface PositionsResult {
	quarters: Quarters;
}

export interface FilesResult {
	files: FileResponse[];
}

export interface IInstrumentsResult {
	instruments: IInstrument[];
}

export class IUpdateStatus {
	error: string;
	warnings: string[];
}

interface MidiFileResponse {
	path: Path;
    data: string;
    sourceId: DocumentSourceId;
}

interface FileDialogResult {
	file: string;
}

class WerckFile extends AFile {
    constructor(from: FileResponse) {
		super(from);
        if (from) {
			if (from.data) {
				this.content = new TextFileContent(from.data);
			}
        }
	}
	private static getTemplate(fileType: FileType): string {
		switch(fileType) {
			case FileType.Template: return TmplSheetTemplate;
			case FileType.Chords: return TmplChordDef;
			case FileType.Pitchmap: return TmplPitchmap;
			default: return "";
		}
	}
	static createEmptyFile(fileType: FileType): WerckFile {
		let fileData:FileResponse = {
			content: null,
			data: WerckFile.getTemplate(fileType),
			extension: ExtensionMap[fileType],
			filename: "New File",
			equals: null,
			hasContent: null,
			path: null,
			sourceId: UndefinedSourceId,
			isNew: null
		};
		return new WerckFile(fileData);
	}
}

class SheetFile extends AFile implements ISheetFile {
	error: string;
	warnings: string[];
    constructor(from: FileResponse) {
		super(from);
		if (from.data !== undefined) {
			this.content = new TextFileContent(from.data);
		}
	}

	assign(from: FileResponse) {
		super.assign(from);
		this.error = (from as any).error;
		this.warnings = (from as any).warnings;
	}

	get hasError(): boolean {
		return !!this.error;
	}
	get hasWarnings(): boolean {
		return !!this.warnings && this.warnings.length > 0;
	}
	updateStatus(status: IUpdateStatus):void {
		this.error = status.error;
		this.warnings = status.warnings;
	}
	static createEmptySheet(): SheetFile {
		let sheetData:FileResponse = {
			content: null,
			data: TmplNewSheet,
			extension: AppConfig.knownExtensions.sheet,
			filename: "New Sheet",
			equals: null,
			hasContent: null,
			path: null,
			sourceId: UndefinedSourceId,
			isNew: null
		};
		return new SheetFile(sheetData);
	}
}

class MidiFile extends AFile {
    constructor(from: MidiFileResponse) {
		super();
        if (from) {
            this.path = from.path;
			this.sourceId = from.sourceId;
			if (from.data) {
				this.content = new BinaryFileContent(strToArrayBuffer(from.data));
			}
        }
    }
}

class TutorialFile extends SheetFile {
    constructor(fileResponse: FileResponse, text: string) {
        super(fileResponse);
        this.extension = AppConfig.knownExtensions.tutorial;
		this.content = new TextFileContent(text);
		this.content.changed = true;
	}
}
@Injectable({
	providedIn: 'root'
})
export class BackendService {

	logger: ILogger;
	config: ConfigResult;
	constructor() {
	}

	ready(): Promise<ConfigResult> {
		return this.appGetConfig();
	}

	// app
	appGetConfig(): Promise<ConfigResult> {
		if (!!this.config) {
			return new Promise(resolve=>{
				resolve(this.config);
			});
		}
		return this.callLeitung<ConfigResult>("app_getConfig")
			.then(result => result);
	}
	appGetArgv(): Promise<string[]> {
		return this.callLeitung<ArgvResult>("app_getArgs")
			.then(result => result.argv);
	}
	appShowOpenFileDialog(options: FileDialogOptions): Promise<string> {
		return this.callLeitung<FileDialogResult>("app_showOpenFileDialog", options)
			.then(result => result.file);
	}
	appShowSaveFileDialog(options: FileDialogOptions): Promise<string> {
		console.log(options);
		return this.callLeitung<FileDialogResult>("app_showSaveFileDialog", options)
			.then(result => result.file);
	}
	appExit(): void {
		this.callLeitung<void>("app_exit");
	}
	appGetMidiDevices(): Promise<MidiDevicesResult> {
		return this.callLeitung<MidiDevicesResult>("app_listMidiDevices");
	}
	
	appGetRelativePath(file: IFile, path: string): Promise<string> {
		return this.callLeitung<ValueResult<string>>("app_getRelativePath", {basePath: file.path, path})
			.then(x=>x.value);
	}
	appOpenLink(url: string): Promise<void> {
		return this.callLeitung<void>("app_openLink", {url});
	}
	async appCreateVirtualSheet(text: string): Promise<ISheetFile> {
		let res = await this.callLeitung<FileResponse>("app_createVirtualFile");
		return new TutorialFile(res, text);	
	}
	async appCreateNewFile(path: Path, fileType: FileType): Promise<IFile> {
		let file = WerckFile.createEmptyFile(fileType);
		file.path = path;
		await this.werckSaveFile(file);
		return file;
	}

	// editor
	async editorLoadFile(path: string): Promise<IFile> {
		let res = await this.callLeitung<FileResponse>("editor_loadFile", {path});
		return new WerckFile(res);
	}


	async werckCompileSource(text: string): Promise<ISheetFile> {		
		let res = await this.callLeitung<FileResponse>("app_compileSource", {text});
		return new TutorialFile(res, text);	
	}

	//sheet
	async werckOpenSheet(path: string): Promise<ISheetFile> {
		let res = await this.callLeitung<FileResponse>("werck_openSheet", {path});
		return new SheetFile(res);
	}
	
	async werckGetSheetFiles() : Promise<IFile[]> {
		let result = await this.callLeitung<FilesResult>("werck_getSheetFiles");
		return  _(result.files).map(x=>new WerckFile(x)).value();
	}
	werckGetEvents(sourceId: DocumentSourceId): Promise<IEventInfo[]> {
		return this.callLeitung<EventsResult>("werck_getEvents", {sourceId})
			.then(result => result.events);	
	}	
	werckGetEventsAt(position: number): Promise<IEventInfo[]> {
		return this.callLeitung<EventsResult>("werck_getEventsAt", {position})
			.then(result => result.events);	
	}
	werckGetEventsAtCurrentTime(): Promise<IEventInfo[]> {
		return this.callLeitung<EventsResult>("werck_getEventsAtCurrentTime")
			.then(result => result.events);	
	}	
	werckPlay(startPosition: Ticks = 0) : Promise<void> {
		return this.callLeitung<void>("werck_play", {startPosition});
	}
	werckStop() : Promise<void> {
		return this.callLeitung<void>("werck_stop");
	}
	werckGetCurrentPosition() : Promise<PositionsResult> {
		return this.callLeitung<PositionsResult>("werck_getCurrentPosition");
	}
	werckGetTotalDuration() : Promise<PositionsResult> {
		return this.callLeitung<PositionsResult>("werck_getTotalDuration");
	}
	werckSaveFile(file: IFile) : Promise<any> {
		let args = {
			sourceId: file.sourceId, 
			path: file.path,
			data: (file.content as ITextFileContent).data
		};
		return this.callLeitung<any>("werck_saveFile", args);
	}
	async werckUpdate(file: ISheetFile) : Promise<IUpdateStatus> {
		let status = await this.callLeitung<IUpdateStatus>("werck_update");
		(file as SheetFile).updateStatus(status);
		return status;
	}
	werckCreateNewSheet(): Promise<ISheetFile> {
		return new Promise(resolve=>{
			resolve(SheetFile.createEmptySheet());
		});
	}
	werckGetInstruments(): Promise<IInstrument[]> {
		return this.callLeitung<IInstrumentsResult>("werck_getInstruments")
			.then(result => result.instruments);
	}
	werckSendMidiEvent(instrument: IInstrument, ev: MidiEvent): Promise<void> {
		let midiEvent = {
			type: ev.eventType,
			channel: ev.channel,
			parameter1: ev.parameter1,
			parameter2: ev.parameter2,
			device: instrument.device
		}
		return this.callLeitung<void>("werck_sendMidiEvent", midiEvent);
	}
	async werckGetMidiFile(): Promise<MidiFile>  {
		let fileResponse =  await this.callLeitung<MidiFileResponse>("werck_getMidiFile");
		return new MidiFile(fileResponse);
	}
	async werckCloseSheet(): Promise<void> {
		await this.callLeitung<void>("werck_closeSheet");
	}
	werckExportMidi(path: String): Promise<void> {
		return this.callLeitung<void>("werck_exportMidi", {path});
	}
	//////////
	get appLeitungRemote(): AppLeitungRemoteCall {
		return (window as any).fm_app_leitung;
	}
	
	callLeitung<T>(action: string, args: {} = {}): Promise<T> {
		return new Promise<any>((resolve, reject) => {
			if (!this.appLeitungRemote) {
				resolve({});
			}
			this.appLeitungRemote(action, args, (result: any) => {
				if (result.exception) {
					if (this.logger) {
						this.logger.error(result.exception);
					}
					reject(result.exception)
				}
				resolve(result);
			});
		});
	}
}
