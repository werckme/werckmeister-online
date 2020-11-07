import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARestService } from '../../services/arest.service';
import { environment } from 'src/environments/environment';

export interface IWorkspace {
    wid: string;
    files: IFile[];
}

export interface IFile {
    path: string;
    data: string;
}
  

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStorageService extends ARestService {
  protected endpointUrl = environment.workspaceStorage;
  constructor(http: HttpClient) { 
    super(http);
  }

  public async newWorkspace(): Promise<IWorkspace> {
    return this.get<IWorkspace>();
  }

  public async loadWorkspace(id: string): Promise<IWorkspace> {
    return this.get<IWorkspace>(id);
  }

  public async updateWorkspace(workspace: IWorkspace): Promise<IWorkspace> {
    return this.post('', workspace);
  }

}
