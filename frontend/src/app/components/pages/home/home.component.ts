import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public gutter = {xs:0, md: 32, lg: 64, xl: 100, xxl: 100};

  constructor() { }

  ngOnInit() {
  }

}
