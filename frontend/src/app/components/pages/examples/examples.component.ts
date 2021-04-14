import { Component, OnInit } from '@angular/core';
import { ISongInfo, SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  private songs: ISongInfo[];

  constructor(private songsService: SongsService) { }

  async ngOnInit() {
    this.songs = await this.songsService.getSongs();
  }

}
