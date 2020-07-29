import { Component, OnInit, Input } from '@angular/core';
import { IRelease, IAsset } from 'src/app/services/github.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-download-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {

  @Input()
  release: IRelease;
  windows: IAsset;
  mac: IAsset;
  linux: IAsset;

  constructor() { }

  ngOnInit() {
    this.windows = _(this.release.assets)
      .find(x => !!x.name.toLowerCase().match(/win32|64/));
    this.mac = _(this.release.assets)
      .find(x => x.name.toLowerCase().indexOf('darwin') >= 0);
    this.linux = _(this.release.assets)
      .find(x => x.name.toLowerCase().indexOf('linux') >= 0);         
  }

}
