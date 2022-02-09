import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { ISongInfo } from 'src/app/services/songs.service';


export function songCardHtmlName(txt: string) {
  return 'songcard-' + _.kebabCase(txt);
}

@Component({
  selector: 'app-song-card',
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent implements OnInit {

  htmlName(text: string) {
    return songCardHtmlName(text);
  }

  @Input()
  public song: ISongInfo;

  @Output()
  public onTagClicked = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

}
