import { Component, Input, OnInit } from '@angular/core';
import { IResourcesInfo } from 'src/app/services/resources.service';

@Component({
  selector: 'app-song-preview',
  templateUrl: './song-preview.component.html',
  styleUrls: ['./song-preview.component.scss']
})
export class SongPreviewComponent implements OnInit {

  @Input()
  public song: IResourcesInfo;

  constructor() { }

  ngOnInit() {
  }

}
