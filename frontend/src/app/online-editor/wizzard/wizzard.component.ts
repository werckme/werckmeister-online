import { Component, OnInit } from '@angular/core';
import { ITemplate, ITemplateInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';

type Styles = {[key: string]: ITemplateInfo[]};

@Component({
  selector: 'app-wizzard',
  templateUrl: './wizzard.component.html',
  styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent implements OnInit {

  public styles: Styles = {}
  constructor(private service: WizzardService) { }

  async ngOnInit(): Promise<void> {
    const templates = await this.service.getTemplates();
    this.styles = _(templates)
      .groupBy(x => x.metaData.title)
      .value();
  }

}
