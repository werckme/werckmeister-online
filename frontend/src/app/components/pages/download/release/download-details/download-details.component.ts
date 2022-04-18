import { Component, OnInit, Input } from '@angular/core';
import { IAsset } from 'src/app/services/github.service';

export interface Download extends IAsset {
  icon: string;
  installation: string;
}

@Component({
  selector: 'app-download-details',
  templateUrl: './download-details.component.html',
  styleUrls: ['./download-details.component.scss']
})
export class DownloadDetailsComponent implements OnInit {

  @Input() download: Download;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
