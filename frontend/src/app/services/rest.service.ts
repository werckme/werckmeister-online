import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IFile, ICompiledSheetFile, ISheetFile } from 'src/shared/io/file';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { TextFileContent } from 'src/shared/io/fileContent';
import { environment } from '../../environments/environment';
import { ARestService } from './arest.service';

@Injectable({
	providedIn: 'root'
})
export class RestService extends ARestService {
	protected endpointUrl = environment.restEndpoint;
	constructor(http: HttpClient) { 
		super(http);
	}

	fileToRequestFiles(file: IFile) {
		if (!file) {
			return null;
		}
		if (file.extension === AppConfig.knownExtensions.tutorial) {
			file.extension = AppConfig.knownExtensions.sheet;
		}
		return {path: file.filename, data: (file.content as TextFileContent).data};
	}

	async compile(files: IFile[]): Promise<ICompiledSheetFile> {
		const requestFiles: any = _(files)
			.map((file: IFile) => this.fileToRequestFiles(file))
			.filter( x => !!x )
			.value()
		;
		const sheet: any = _(files).filter(x => x.extension === '.sheet').first();
		const response: any = await this.post('compile', requestFiles);
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
}
