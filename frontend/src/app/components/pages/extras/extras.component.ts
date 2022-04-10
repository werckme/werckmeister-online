import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.component.html',
  styleUrls: ['./extras.component.scss']
})
export class ExtrasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public confXs = {span: 24};
  public confSm = {span: 24};
  public confMd = {span: 12};
  public confXl = {span: 8};
  public confXXl = {span: 8};
}
