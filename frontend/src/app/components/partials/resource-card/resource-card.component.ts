import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { IResourcesInfo } from 'src/app/services/resources.service';


export function songCardHtmlName(txt: string) {
  return 'songcard-' + _.kebabCase(txt);
}

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent implements OnInit {

  htmlName(text: string) {
    return songCardHtmlName(text);
  }

  @Input()
  public resource: IResourcesInfo;

  @Output()
  public onTagClicked = new EventEmitter<string>();
  
  constructor() { }

  public get url(): string|undefined {
    return this.resource.metaData.url;
  }

  ngOnInit() {
  }

}
