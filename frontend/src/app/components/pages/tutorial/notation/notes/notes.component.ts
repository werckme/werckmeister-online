import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';


const snippets = [
`
tempo: 120;
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
[
instrument: ex1;
{

	c4 d e f | g a b c' |


}
]

`
,
`
tempo: 120;
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
[
instrument: ex1;
{

	cis dis fis gis | bes des' es' ges' |


}
]

`
,
`
tempo: 80;
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
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
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
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
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
[
instrument: ex1;
{

	c2. c4 | c2~ c4	 c |


}
]

`
,
`
tempo: 120;
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
[
instrument: ex1;
{

	c8t c c   c8n5 c c c c  c8n7 c c c c c c  c8n9 c c c c c c c c |


}
]

`
,
`
tempo: 80;
device: MyDevice  midi $PORTNR;
instrumentDef:ex1  MyDevice  2 0 0;
[
instrument: ex1;
{

	<g,, c e g bes>4 <c, c es g bes>2. |


}
]

`
]
;


@Component({
	selector: 'app-write-notes',
	templateUrl: './notes.component.html',
	styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends ATutorial implements OnInit {
	files: IFile[] = [];
	constructor(werck: WerckService, route: Router) {
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
