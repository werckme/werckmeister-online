import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

export interface IListOfContentsEntry {
  title: string;
  level: number;
  anchorId: string;
  active?: boolean;
}

@Component({
  selector: 'app-list-of-contents',
  templateUrl: './list-of-contents.component.html',
  styleUrls: ['./list-of-contents.component.scss']
})
export class ListOfContentsComponent implements OnInit {

  private _activeAnchorId: string;
  @Input()
  set activeAnchorId(id: string) {
    this._activeAnchorId = id;
    this.activateEntry(id);
  }

  get activeAnchorId(): string {
    return this._activeAnchorId;
  }

  private deactivateAllEntries() {
    for(const entry of this.toc) {
      entry.active = false;
    }
  }
  private activateEntry(anchorId: string) {
    this.deactivateAllEntries();
    const entry = _(this.toc).find(entry => entry.anchorId === anchorId);
    if (!entry) {
      return;
    }
    entry.active = true;
  }

  @Input()
  toc: IListOfContentsEntry[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
