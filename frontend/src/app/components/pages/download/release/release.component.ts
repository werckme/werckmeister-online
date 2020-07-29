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
  windows: Download;
  mac: Download;
  linux: Download;
  body: string;
  mdParser = new Converter();
  
  constructor() { }

  private parseBody() {
    this.body = this.md(this.release.body);
  }

  private md(str: string) {
    return this.mdParser.makeHtml(str);
  }

  ngOnInit() {
    const parser = new Converter();
    this.parseBody();
    this.windows = _(this.release.assets)
      .find(x => !!x.name.toLowerCase().match(/win32|64/)) as Download;
    this.mac = _(this.release.assets)
      .find(x => x.name.toLowerCase().indexOf('darwin') >= 0) as Download;
    this.linux = _(this.release.assets)
      .find(x => x.name.toLowerCase().indexOf('linux') >= 0) as Download;
    this.windows.icon = 'windows';
    this.windows.installation = this.md(`Execute the installer program \`${this.windows.name}\``);
    this.mac.icon = 'apple';
    this.mac.installation = this.md(`* Open the Terminal
* Navigate to the location where your downloads are located. (e.g. \`cd ~/Downloads\`) 
* Run this command:

\`\`\`sudo sh ${this.mac.name} --prefix=/usr/local --exclude-subdir\`\`\``);
    this.linux.icon = 'qq';
    this.linux.installation = this.md(`* Open the Terminal
* Navigate to the location where your downloads are located. (e.g. \`cd ~/Downloads\`) 
* Run this command:
    
\`\`\`sudo sh ${this.linux.name} --prefix=/usr/local --exclude-subdir\`\`\``);      
  }

}
