import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IHasUrl } from 'src/shared/IHasUrl';

@Component({
  selector: 'app-embedded-soundcloud-link',
  templateUrl: './embedded-soundcloud-link.component.html',
  styleUrls: ['./embedded-soundcloud-link.component.scss']
})
export class EmbeddedSoundcloudLinkComponent implements OnInit, IHasUrl {

  url: string;

  ngOnInit() {
  }

  constructor(private sanitizer: DomSanitizer) { }

  get soundCloudUrl(): SafeUrl {
    const url = this.url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


}
