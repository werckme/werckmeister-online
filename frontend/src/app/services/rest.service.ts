import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IFile, ICompiledSheetFile, ISheetFile } from 'src/shared/io/file';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { TextFile, TextFileContent } from 'src/shared/io/fileContent';
import { DefaultChords } from 'src/shared/werck/com/chords';
@Injectable({
	providedIn: 'root'
})
export class RestService {
	protected endpointUrl: string = "http://localhost:10000/api";
	constructor(protected http: HttpClient) { }

	protected deserialize<TDomain>(obj: TDomain, json: any): TDomain {
		return Object.assign(obj, json);
	}

	protected get<T>(url: string): Promise<T> {
		return this.http.get<T>(`${this.endpointUrl}/${url}`).toPromise();
	}

	protected put<T>(url: string, body: any): Promise<T> {
		return this.http.put<T>(`${this.endpointUrl}/${url}`, body).toPromise();
	}

	protected post<T>(url: string, body: any): Promise<T> {
		return this.http.post<T>(`${this.endpointUrl}/${url}`, body).toPromise();
	}

	protected delete<T>(url: string): Promise<T> {
		return this.http.delete<T>(`${this.endpointUrl}/${url}`).toPromise();
	}

	addAdditionalFiles(requestFiles) {
		requestFiles.push({
			path: 'chords/default.chords',
			data: DefaultChords
		});
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
		this.addAdditionalFiles(requestFiles);
		const sheet:any = _(files).filter(x=>x.extension === '.sheet').first();
		const response:any = await this.post('compile', requestFiles);
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
