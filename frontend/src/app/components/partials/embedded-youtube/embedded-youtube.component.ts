import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IHasUrl } from 'src/shared/IHasUrl';

@Component({
  selector: 'app-embedded-youtube',
  templateUrl: './embedded-youtube.component.html',
  styleUrls: ['./embedded-youtube.component.scss']
})
export class EmbeddedYoutubeComponent implements OnInit, IHasUrl {
  @Input()
  url: string;
  constructor(private sanitizer: DomSanitizer) { }

  get ytUrl(): SafeUrl {
    // https://www.youtube.com/watch?v=XEWmzQ_fJmw
    const ytId = this.url.match(/watch\?v=(.+)/)[1]
    const url = `https://www.youtube-nocookie.com/embed/${ytId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
  }

}
