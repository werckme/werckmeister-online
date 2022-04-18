import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ARestService } from './arest.service';

export interface IResourcesInfo {
  wid?: string;
  eid?: string;
  metaData: {
    title: string;
    by: string[];
    tags: string[];
    description: string;
    preview: string;
    url?: string;
    links: {
      url: string;
      title:string;
    }[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class ResourcesService extends ARestService {
  protected endpointUrl = environment.workspaceStorage;
  constructor(http: HttpClient) { 
    super(http);
  }

  public getResources():Promise<IResourcesInfo[]> {
    return this.get<IResourcesInfo[]>('resources');
  }

  public getCreatorsSongs(creatorid):Promise<IResourcesInfo[]> {
    return this.get<IResourcesInfo[]>(`creator/${creatorid}`);
  }

}
