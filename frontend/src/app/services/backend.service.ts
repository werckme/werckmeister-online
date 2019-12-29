import { Injectable } from '@angular/core';
import { IFile, AFile, strToArrayBuffer, ISheetFile, UndefinedSourceId, FileType, ExtensionMap } from 'src/shared/io/file';
import { IEventLocation } from 'src/shared/editor/EventLocation';
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
	events: IEventLocation[];
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

class SheetFile extends AFile implements ISheetFile {
    constructor(from: FileResponse) {
		super(from);
		if (from.data !== undefined) {
			this.content = new TextFileContent(from.data);
		}
	}

	get hasError(): boolean {
		return !!this.error;
	}
	get hasWarnings(): boolean {
		return !!this.warnings && this.warnings.length > 0;
	}
	error: string;
	warnings: string[];
	static createEmptySheet(): SheetFile {
		const sheetData: FileResponse = {
			content: null,
			data: TmplNewSheet,
			extension: AppConfig.knownExtensions.sheet,
			filename: 'New Sheet',
			equals: null,
			hasContent: null,
			path: null,
			sourceId: UndefinedSourceId,
			isNew: null
		};
		return new SheetFile(sheetData);
	}

	assign(from: FileResponse) {
		super.assign(from);
		this.error = (from as any).error;
		this.warnings = (from as any).warnings;
	}

	updateStatus(status: IUpdateStatus): void {
		this.error = status.error;
		this.warnings = status.warnings;
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

	async appCreateVirtualSheet(text: string, filename: string): Promise<ISheetFile> {
		const fileResponse = {} as FileResponse;
		const result = new TutorialFile(fileResponse, text);
		result.filename = filename;
		return result;	
	}

	// sheet
}
