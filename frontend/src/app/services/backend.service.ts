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


	async appCreateVirtualSheet(text: string): Promise<ISheetFile> {
		const fileResponse = {} as FileResponse;
		return new TutorialFile(fileResponse, text);	
	}


	//sheet
}
