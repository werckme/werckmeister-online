import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterEvent, RouterState } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { ISongInfo, SongsService } from 'src/app/services/songs.service';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit, OnDestroy {

  public songs: ISongInfo[] = [];
  public filteredSongs: ISongInfo[] = [];
  public allTags: string[] = [];
  public filters: string[] = [];
  private routerSubscription: Subscription;

  constructor(private songsService: SongsService, private route: ActivatedRoute) { }

  private getSongOrderField(song: ISongInfo) {
    return song.metaData.title;
  }

  private async loadSongs() {
    this.songs = _(await this.songsService.getSongs())
      .orderBy(song => this.getSongOrderField(song))
      .value();

    this.allTags = _(this.songs)
      .map(x => x.metaData.tags)
      .flatten()
      .uniq()
      .sort()
      .value();
    this.applyFilter(this.filters);
  }

  private onRouteChanged(params: Params) {
    let filters: string | string[] = params['tag'];
    if (!filters) {
      return;
    }
    if (!Array.isArray(filters)) {
      filters = [filters];
    }
    this.filters = filters;
    const isSongsLoaded = _.some(this.songs);
    if (!isSongsLoaded) {
      return;
    }
    this.applyFilter(this.filters);
  }

  public async ngOnInit() {
    this.loadSongs();
    this.routerSubscription = this.route.queryParams.subscribe(this.onRouteChanged.bind(this));
  }

  public ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }


  public addTagFilter(name: string) {
    this.filters = _(this.filters).concat([name]).uniq().value();
    this.filter(this.filters);
  }

  async updateUrl(filters: string[]): Promise<void> {
    const url = new URL(window.location.pathname, window.location.origin);
    for (const filter of filters) {
      url.searchParams.append("tag", filter);
    }
    history.replaceState({}, null, url.toString());
  }

  filter(filters: string[]) {
    this.updateUrl(filters);
    this.applyFilter(filters);
  }

  private applyFilter(filters: string[]) {
    if (filters.length === 0) {
      this.filteredSongs = this.songs;
      return;
    }
    this.filteredSongs = _(this.songs)
      .filter(song => _(song.metaData.tags).intersection(filters).some())
      .orderBy(song => this.getSongOrderField(song))
      .value()
      ;
  }
}
