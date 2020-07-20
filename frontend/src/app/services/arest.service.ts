import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';


export abstract class ARestService {
	protected abstract endpointUrl: string;
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
}
