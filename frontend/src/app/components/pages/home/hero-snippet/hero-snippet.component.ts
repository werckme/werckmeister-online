import { Component, OnInit } from '@angular/core';
import { AdditionalFiles, DefLinesTemplate, MainSheet } from './src/main.sheet';

@Component({
  selector: 'app-hero-snippet',
  templateUrl: './hero-snippet.component.html',
  styleUrls: ['./hero-snippet.component.scss']
})
export class HeroSnippetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public get mainSheet(): string {
    return btoa(MainSheet);
  }

  public get additionalFiles(): string {
    const json = JSON.stringify(AdditionalFiles);
    return btoa(json);
  }

  public get defs(): string {
    const defs = DefLinesTemplate;
    return btoa(defs);
  }

}
