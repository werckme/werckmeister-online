import { Component, OnInit } from '@angular/core';
import { IFile } from 'src/shared/io/file';
import { WerckService } from 'src/app/services/werck.service';
import { Router } from '@angular/router';
import { ATutorial } from '../tutorial/ATutorial';


const snippets = [
  `
  tempo: 120;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    c d e f | g a b c' |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 120;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    c# d# f# g# | bb db' eb' gb' |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 80;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    c2 c4 c8 c16 c32 c64 c128 r |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 120;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    c,,16  e,,  g,, c, e, g, c e g c' e' g' c'' e'' g'' c''' |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 120;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    c2. c4 | c2~ c4	 c |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 60;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    (c8 c c)4   (c8 c c c c)4  (c8 c c c c c c)4  (c8 c c c c c c c c)4 |
  
  
  }
  ]
  
  `
  ,
  `
  tempo: 80;
  device: MyDevice  midi 0;
  instrumentDef:ex1  MyDevice  0 0 0;
  [
  instrument: ex1;
  {
  
    <g,, c e g bb>4 <c, c eb g bb>2. |
  
  
  }
  ]
  
  `
  ]
  ;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ATutorial implements OnInit {

	files: IFile[] = [];
	constructor(werck: WerckService, route: Router) {
		super(route, werck);
	}

	async ngOnInit() {
		for (const snippet of snippets) {
			const text = this.prepareSnippet(snippet);
			const file = await this.werck.createTutorialFile(text);
			this.files.push(file);
		}
	}

}
