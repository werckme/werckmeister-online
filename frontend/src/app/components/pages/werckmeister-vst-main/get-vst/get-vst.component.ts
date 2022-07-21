import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { GithubService, IRelease } from 'src/app/services/github.service';

@Component({
  selector: 'app-get-vst',
  templateUrl: './get-vst.component.html',
  styleUrls: ['./get-vst.component.scss']
})
export class GetVstComponent implements OnInit {

  latestRelease: IRelease;
  constructor(private git: GithubService) { }

  async ngOnInit() {
    await this.getReleases();
  }

  private async getReleases() {
    const releases = await this.git.getVstReleases();
    this.latestRelease = _(releases)
      .orderBy(x => x.published_at, 'desc')
      .first();
  }

}
