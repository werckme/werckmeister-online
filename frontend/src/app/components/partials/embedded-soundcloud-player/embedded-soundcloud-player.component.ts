import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const smallPlayerOptions="color=%23ff5500&inverse=false&auto_play=false&show_user=true";
const classicPlayerOptions="color=%23ff5500&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false&show_teaser=true";

@Component({
  selector: 'app-embedded-soundcloud-player',
  templateUrl: './embedded-soundcloud-player.component.html',
  styleUrls: ['./embedded-soundcloud-player.component.scss']
})
export class EmbeddedSoundcloudPlayerComponent implements OnInit {

  @Input()
  url: string;

  @Input()
  small:boolean;

  get soundCloudUrl(): SafeUrl {
    const encodedUrl = encodeURIComponent(this.url);
    const playerOptions:string = this.small ? smallPlayerOptions : classicPlayerOptions;
    const url = `https://w.soundcloud.com/player/?url=${encodedUrl}&${playerOptions}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get height(): number {
    return this.small ? 20 : 166;
  }

  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {
  }

}