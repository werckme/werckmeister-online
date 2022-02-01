import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterState } from '@angular/router';
import * as _ from 'lodash';
import { ISongInfo, SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  public songs: ISongInfo[] = [];
  public filteredSongs: ISongInfo[] = [];
  public tags: string[] = [];
  public filters: string[] = [];

  constructor(private songsService: SongsService, private route: ActivatedRoute) { }

  private getSongOrderField(song: ISongInfo) {
    return song.metaData.title;
  }

  async ngOnInit() {
    this.songs = _(await this.songsService.getSongs())
      .orderBy(song => this.getSongOrderField(song))
      .value();

    this.filteredSongs = this.songs;
    this.tags = _(this.songs)
      .map(x => x.metaData.tags)
      .flatten()
      .uniq()
      .sort()
      .value();
  }

  addTagFilter(name: string) {
    this.filters = _(this.filters).concat([name]).uniq().value();
    this.filter(this.filters);
  }

  async updateUrl(filters: string[]): Promise<void> {
    const url = new URL(window.location.pathname, window.location.origin);
    for(const filter of filters) {
      url.searchParams.append("tag", filter);
    }
    console.log(url.toString())
    history.replaceState({}, null, url.toString());
  }

  filter(filters: string[]) {
    this.updateUrl(filters);
    if (filters.length === 0) {
      this.filteredSongs = this.songs;
      return;
    }
    this.filteredSongs = _(this.songs)
      .filter( song => _(song.metaData.tags).intersection(filters).some() )
      .orderBy(song => this.getSongOrderField(song))
      .value()
    ;
  }
}
