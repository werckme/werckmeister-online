import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';

const snippets = [
`
tempo: 100;
device: MyDevice  midi $PORTNR;


-- 				name  device  ch  cc  pc
instrumentDef: piano MyDevice  0   0   0;


[
instrument: piano;
{
	fis8   a    e      b,  b,4        cis16 d cis b,  |   cis1	  |
}
]




`
,
`
tempo: 100;
device: MyDevice  midi $PORTNR;


-- 				name  device  ch  cc  pc
instrumentDef: piano MyDevice  0   0   0;


[
instrument: piano;
{
	fis8   a    e      b,  b,4        cis16 d cis b,  |   cis1	      |
}
{
	<d, g, a,>4 <d, g, a,> <d, g, a,>4 <d, g, a,>     |  <d, g, a,>1  |
}
]




`
,
`
tempo: 100;
device: MyDevice  midi $PORTNR;


-- 				name         device  ch  cc  pc
instrumentDef: vibraphone  MyDevice  0   0   11;
instrumentDef: harpsichord MyDevice  1   0    6;


[
instrument: vibraphone;
{
	fis8   a    e      b,  b,4        cis16 d cis b,  |   cis1        |
}
]

[
instrument: harpsichord;
{
	<d, g, a,>4 <d, g, a,> <d, g, a,>4 <d, g, a,>     |  <d, g, a,>1  |
}
]



`
];


@Component({
	selector: 'app-tracks',
	templateUrl: './tracks.component.html',
	styleUrls: ['./tracks.component.scss']
})
export class TracksComponent extends ATutorial implements OnInit {

	files: IFile[] = [];
	constructor(route: Router, werck: WerckService) {
		super(route, werck);
	}

	async ngOnInit() {
		for (let snippet of snippets) {
			let text = this.prepareSnippet(snippet);
			let file = await this.werck.createTutorialFile(text);
			this.files.push(file);
		}
	}

}
