import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public gutter = {xs:0, md: 0, lg: 0, xl: 0, xxl: 0};

  constructor() { }

  ngOnInit() {
  }

}
