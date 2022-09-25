import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARestService } from '../../services/arest.service';
import { environment } from 'src/environments/environment';

export const TmpWorkspaceWid = "temporarily-workspace-save-to-get-a-persistent-url";
const storageWorkspaceKey = "tmpWorkspace";

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
    if (id === TmpWorkspaceWid) {
      const workspace = this.tmpWorkspace;
      if (workspace === null) {
        const msg = "Could not open tmp workspace. The next time, please save before sharing";
        const ex = new Error(msg) as any;
        ex.userFriendlyMessage = msg;
        throw ex;
      }
      return workspace;
    }
    return this.get<IWorkspace>(id);
  }

  public async updateWorkspace(workspace: IWorkspace): Promise<{succeed: boolean, wid: string}> {
    return this.post('', workspace);
  }

  private get tmpWorkspace(): IWorkspace|null {
    const jsonStr = sessionStorage.getItem(storageWorkspaceKey);
    if (!jsonStr) {
      return null;
    }
    try {
      return JSON.parse(jsonStr);
    } catch(ex) {
      return null;
    }
  }

  private set tmpWorkspace(workspace: IWorkspace) {
    sessionStorage.setItem(storageWorkspaceKey, JSON.stringify(workspace));
  }

  public async setTmpWorkspace(workspace: IWorkspace): Promise<{succeed: boolean, wid: string}> {
    this.tmpWorkspace = workspace;
    return {succeed: true, wid: TmpWorkspaceWid};
  }

}
