import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IResourcesInfo, ResourcesService } from 'src/app/services/resources.service';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.scss']
})
export class CreatorComponent implements OnInit, OnDestroy {

  public songs: IResourcesInfo[];
  private creatorid: string;
  private routerSubscription: Subscription;
  constructor(private songsService: ResourcesService, private router: Router, private route: ActivatedRoute,) { 
    this.routerSubscription = this.router.events.subscribe((ev)=>{
      if (ev instanceof NavigationEnd) {
        this.creatorid = this.route.snapshot.queryParams.id;
        this.update();
      } 
    });
  }

  ngOnInit(): void {
  }

  async update() {
    if (!this.creatorid) {
      return;
    }
    this.songs = await this.songsService.getCreatorsSongs(this.creatorid);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}
