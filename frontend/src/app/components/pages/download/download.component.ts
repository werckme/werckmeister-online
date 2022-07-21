import { Component, OnInit } from '@angular/core';
import { GithubService, IRelease } from 'src/app/services/github.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  latestRelease: IRelease;
  fetchingFailed: boolean = false;
  constructor(private git: GithubService) { }

  ngOnInit() {
    this.getReleases();
  }

  private async getReleases() {
    try {
      const releases = await this.git.getWerckmeisterReleases();
      this.latestRelease = _(releases)
        .orderBy(x => x.published_at, 'desc')
        .first();
    } catch {
      this.fetchingFailed = true;
    }
  }

}
