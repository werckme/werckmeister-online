import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IFile } from 'src/shared/io/file';

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

	async compile(files: IFile[]) {
		const res = await this.post('compile', files);
	}
}
