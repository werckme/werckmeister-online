import { Injectable } from '@angular/core';
import { ARestService } from './arest.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface ITemplateInfo {
  id: string;
  metaData: {
    title: string;
    tags: string[];
    instrument: string;
    signature: string;
    tempo: number;
    instrumentConfigs: string[]
  }
}

export interface ITemplate {
  id: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class WizzardService extends ARestService{
  protected endpointUrl: string = environment.workspaceStorage;

  constructor(http: HttpClient) { 
    super(http);
  }

  public async getTemplates(): Promise<ITemplateInfo[]> {
    return this.get<ITemplateInfo[]>('styleTemplates');
  }

  public async getTemplate(id: string): Promise<ITemplate> {
    return this.get<ITemplate>(`styleTemplate/${id}`);
  }
}
