import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IFile } from 'src/shared/io/file';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { TextFile, TextFileContent } from 'src/shared/io/fileContent';
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

	fileToRequestFiles(file: IFile) {
		if (!file) {
			return null;
		}
		if (file.extension === AppConfig.knownExtensions.tutorial) {
			file.extension = AppConfig.knownExtensions.sheet;
		}
		file.filename = `main.${file.extension}`;
		return {path: file.filename, data: (file.content as TextFileContent).data};
	}

	async compile(files: IFile[]) {
		const requestFiles: any = _(files)
			.map((file: IFile) => this.fileToRequestFiles(file))
			.filter( x => !!x )
			.value()
		;
		return await this.post('compile', requestFiles);
	}
}
