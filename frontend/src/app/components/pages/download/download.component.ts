import { Component, OnInit } from '@angular/core';
import { GithubService, IRelease } from 'src/app/services/github.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  releases: IRelease[];
  constructor(private git: GithubService) { }

  ngOnInit() {
    this.getReleases();
  }

  private async getReleases() {
    this.releases = await this.git.getWerckmeisterReleases();
    this.releases = _(this.releases)
      .orderBy(x => x.published_at, 'desc')
      .value();
  }

}
