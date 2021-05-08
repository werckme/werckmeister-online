import { Component, Input, OnInit } from '@angular/core';
import { ISongInfo } from 'src/app/services/songs.service';

@Component({
  selector: 'app-song-preview',
  templateUrl: './song-preview.component.html',
  styleUrls: ['./song-preview.component.scss']
})
export class SongPreviewComponent implements OnInit {

  @Input()
  public song: ISongInfo;

  constructor() { }

  ngOnInit() {
  }

}
