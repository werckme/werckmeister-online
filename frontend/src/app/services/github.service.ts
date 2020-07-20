import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ARestService } from './arest.service';
import { environment } from 'src/environments/environment';

export interface IAsset {
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

export interface IRelease {
  tag_name: string;
  name: string;
  created_at: Date;
  published_at: Date;
  body: string;
  assets: IAsset[];
}


@Injectable({
  providedIn: 'root'
})
export class GithubService extends ARestService {
  protected endpointUrl = environment.githubApi;
  constructor(http: HttpClient) { 
    super(http);
  }

  public async getReleases(): Promise<IRelease[]> {
    return this.get(`repos/werckme/werckmeister/releases`);
  }

}
