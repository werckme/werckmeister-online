import { Component, Input, OnInit } from '@angular/core';
import { ISongInfo } from 'src/app/services/songs.service';

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent implements OnInit {

  @Input()
  public song: ISongInfo;
  
  constructor() { }

  ngOnInit() {
  }

}
