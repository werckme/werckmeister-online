import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ARestService } from './arest.service';

export interface ISongInfo {
  wid: string;
  metaData: {
    title: string;
    by: string[];
    tags: string[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class SongsService extends ARestService {
  protected endpointUrl = environment.workspaceStorage;
  constructor(http: HttpClient) { 
    super(http);
  }

  public getSongs():Promise<ISongInfo[]> {
    return this.get<ISongInfo[]>('songs');
  }

  public getCreatorsSongs(creatorid):Promise<ISongInfo[]> {
    return this.get<ISongInfo[]>(`creator/${creatorid}`);
  }

}
