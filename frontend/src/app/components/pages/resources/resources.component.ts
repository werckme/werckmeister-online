import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { IResourcesInfo, ResourcesService } from 'src/app/services/resources.service';
import { songCardHtmlName } from '../../partials/resource-card/resource-card.component';

type Orders = "asc" | "desc" | undefined;
type SongOrderBy = {iteratees: ((song: IResourcesInfo) => string | number | boolean)[], orders:Orders[]};

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {

  public songs: IResourcesInfo[] = [];
  public filteredSongs: IResourcesInfo[] = [];
  public allTags: string[] = [];
  public filters: string[] = [];
  private routerSubscription: Subscription;

  constructor(private songsService: ResourcesService, private route: ActivatedRoute, private ref: ElementRef<HTMLElement>) { }

  private isFeatured(song: IResourcesInfo): boolean {
    return song.metaData.tags.includes("featured");
  }

  private getSongOrderBy(): SongOrderBy {
    const iteratees = [song => this.isFeatured(song), song => song.metaData.title];
    const orders: Orders[] = ["desc", "asc"]
    return {iteratees, orders};
  }

  private async loadSongs() {
    const songOrderBy = this.getSongOrderBy();
    this.songs = _(await this.songsService.getResources())
      .orderBy(songOrderBy.iteratees, songOrderBy.orders)
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

  private updateSongCardTagDisplayImpl() {
    const filteredClassName = 'filtered';
    const parent = this.ref.nativeElement;
    parent.querySelectorAll(`.song-card .tag.filtered`)
      .forEach(tag => tag.classList.remove(filteredClassName));    
    for(const filter of this.filters) {
      parent.querySelectorAll(`.song-card .tag.${songCardHtmlName(filter)}`)
        .forEach(x => x.classList.add(filteredClassName));
    }
  }

  updateSongCardTagDisplay = _.debounce(this.updateSongCardTagDisplayImpl.bind(this), 50);

  private applyFilter(filters: string[]) {
    this.updateSongCardTagDisplay();
    if (filters.length === 0) {
      this.filteredSongs = this.songs;
      return;
    }
    const songOrderBy = this.getSongOrderBy();
    this.filteredSongs = _(this.songs)
      .filter(song => _(song.metaData.tags).intersection(filters).some())
      .orderBy(songOrderBy.iteratees, songOrderBy.orders)
      .value()
      ;
  }
}
