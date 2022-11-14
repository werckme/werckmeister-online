import { Injectable } from '@angular/core';
import { ARestService } from './arest.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface IMetaData {
  title: string;
  tags: string[];
  instrument: string;
  signature: string;
  tempo: number;
  instrumentDef?: string;
  instrumentConfig?: string;
  usings: string[];
  auxFiles?: {path: string, data: string}[];
}

export interface IStyleFileInfo {
  id: string;
  metaData: IMetaData;
}

export interface IStyleFile {
  id: string;
  data: string;
}

export interface ISoundFont {
  name: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class WizzardService extends ARestService{
  protected endpointUrl: string = environment.workspaceStorage;

  constructor(http: HttpClient) { 
    super(http);
  }

  public async getStyles(): Promise<IStyleFileInfo[]> {
    return this.get<IStyleFileInfo[]>('styleTemplates');
  }

  public async getStyleFile(id: string): Promise<IStyleFile> {
    return this.get<IStyleFile>(`styleTemplate/${id}`);
  }

  public async getSoundFonts(): Promise<ISoundFont[]> {
    return [
      { name: "FluidR3", path: "FluidR3-GM" },
      { name: "Live HQ Natural SoundFont", path: "Live-HQ-Natural-SoundFont-GM" }
    ];
  } 
}
