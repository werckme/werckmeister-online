import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teaser-collapse',
  templateUrl: './teaser-collapse.component.html',
  styleUrls: ['./teaser-collapse.component.scss']
})
export class TeaserCollapseComponent implements OnInit {

  public isOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onMouseEnter(event: MouseEvent): void {
    this.isOpen = true;
  }

  public onMouseExit(event: MouseEvent): void {
    this.isOpen = false;
  }
}
