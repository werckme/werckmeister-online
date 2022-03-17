import { Component, Input, OnInit } from '@angular/core';

export interface IListOfContentsEntry {
  title: string;
  level: number;
  anchorId: string;
}

@Component({
  selector: 'app-list-of-contents',
  templateUrl: './list-of-contents.component.html',
  styleUrls: ['./list-of-contents.component.scss']
})
export class ListOfContentsComponent implements OnInit {

  @Input()
  toc: IListOfContentsEntry[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
