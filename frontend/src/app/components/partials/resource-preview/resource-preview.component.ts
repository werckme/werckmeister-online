import { Component, OnInit, Input } from '@angular/core';
import { IResourcesInfo } from 'src/app/services/resources.service';

type ResourceType = "youtube" | "unknown";

@Component({
  selector: 'app-resource-preview',
  templateUrl: './resource-preview.component.html',
  styleUrls: ['./resource-preview.component.scss']
})
export class ResourcePreviewComponent implements OnInit {

  get type(): ResourceType {
    let isYt = this.resource.metaData.url?.match(/http|https:\/\/youtu.be.*/);
    isYt = isYt || this.resource.metaData.url?.match(/http|https:\/\/www.youtube.com*/);
    if (isYt) {
      return "youtube";
    }
    return "unknown";
  }

  constructor() { }
  @Input()
  public resource: IResourcesInfo;

  ngOnInit(): void {
  }

  public get ytId(): string {
    const match = this.resource.metaData.url?.match(/.*\/(.*)$/);
    return (match||[])[1];
  }

  public get ytPreviewUrl(): string {
    return `https://img.youtube.com/vi/${this.ytId}/hqdefault.jpg`;
  }

}
