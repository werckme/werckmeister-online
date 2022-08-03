import { Component, OnInit, Input } from '@angular/core';
import { IRelease, IAsset } from 'src/app/services/github.service';
import * as _ from 'lodash';
import {Converter} from 'showdown';
import { Download } from './download-details/download-details.component';

@Component({
  selector: 'app-download-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss']
})
export class ReleaseComponent implements OnInit {

  @Input()
  release: IRelease;

  @Input()
  showInstallationHelp: boolean = true;

  @Input()
  numberOfColumns:number = 1;

  windows: Download[];
  mac: Download[];
  linux: Download[];
  body: string;
  mdParser = new Converter();
  
  constructor() { }

  private parseBody() {
    this.body = this.md(this.release.body || "");
  }

  private md(str: string) {
    return this.mdParser.makeHtml(str);
  }

  processWindowsDownload(download: Download): Download {
    download.icon = 'windows';
    if (!this.showInstallationHelp) {
      return download;
    }
    return download;
  }

  processMacDownload(download: Download): Download {
    download.icon = 'apple';
    return download;
  }

  processLinuxDownload(download: Download): Download {
    download.icon = 'qq';
    if (!this.showInstallationHelp) {
      return download;
    }
    download.installation = this.md(`* Open the Terminal
* \`cd ~/Downloads\`
* \`\`\`sudo sh ${download.name} --prefix=/usr/local --exclude-subdir\`\`\``);    
  return download;  
  }


  ngOnInit() {
    this.parseBody();
    this.windows = _(this.release.assets)
      .filter(x => !!x.name.toLowerCase().match(/win32|64/))
      .map(x => x as Download)
      .map(x => this.processWindowsDownload(x))
      .value();
    this.mac = _(this.release.assets)
      .filter(x => !!x.name.toLowerCase().match(/darwin|mac/))
      .map(x => x as Download)
      .map(x => this.processMacDownload(x))
      .value();
    this.linux = _(this.release.assets)
      .filter(x => x.name.toLowerCase().indexOf('linux') >= 0)
      .map(x => x as Download)
      .map(x => this.processLinuxDownload(x))
      .value();
  }

}
