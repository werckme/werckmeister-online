import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';


export abstract class ARestService {
	protected abstract endpointUrl: string;
	constructor(protected http: HttpClient) { }

	protected deserialize<TDomain>(obj: TDomain, json: any): TDomain {
		return Object.assign(obj, json);
	}

	protected get<T>(url: string = ''): Promise<T> {
		return firstValueFrom(this.http.get<T>(`${this.endpointUrl}/${url}`));
	}

	protected put<T>(url: string, body: any): Promise<T> {
		return firstValueFrom(this.http.put<T>(`${this.endpointUrl}/${url}`, body));
	}

	protected post<T>(url: string, body: any): Promise<T> {
		return firstValueFrom(this.http.post<T>(`${this.endpointUrl}/${url}`, body));
	}

	protected delete<T>(url: string): Promise<T> {
		return firstValueFrom(this.http.delete<T>(`${this.endpointUrl}/${url}`));
	}
}
