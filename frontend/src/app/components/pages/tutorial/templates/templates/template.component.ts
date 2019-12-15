import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';


const snippets = [
`
@load "./chords/default.chords";
tempo: 100;
device: MyDevice  midi $PORTNR;

-- 				name  device  ch  cc  pc
instrumentDef: piano MyDevice  0   0   0;



[
type: template;
name: MyTemplate;
instrument: piano;
{
	I4 V III I | 
}
]

[
type: sheet;
template: MyTemplate;
{
	C7 | D-7 |
}
]



`
,
`
@load "./chords/default.chords";
tempo: 100;
device: MyDevice  midi $PORTNR;


-- 				name  device  ch  cc  pc
instrumentDef: piano MyDevice  0   0   0;
[
type: template;
name: MyTemplate;
instrument: piano;
{
	<I, III, V, VII, I>2. <I III V VII I'>4 |
}
{
	I,,1 |
}
]

[
type: sheet;
template: MyTemplate;
{
	C | G7 | Fmaj7 | Amin | 
}
]


`
,
`
@load "./chords/default.chords";
tempo: 100;
device: MyDevice  midi $PORTNR;


-- 				name  device  ch  cc  pc
instrumentDef: piano MyDevice  0   0   0;
instrumentDef: bass  MyDevice  1   0   33;
[
type: template;
name: MyTemplate;
instrument: piano;
{
	<I, III, V, VII, I>2. <I III V VII I'>4 |
}
]

[
type: template;
name: MyTemplate;
instrument: bass;
{
	I,,2    V,,4  I,4  |
}
]

[
type: sheet;
template: MyTemplate;
{
	C | G7 | Fmaj7 | Amin | 
}
]


`
];

@Component({
	selector: 'app-templates',
	templateUrl: './template.component.html',
	styleUrls: ['./template.component.scss']
})
export class TemplatesComponent extends ATutorial implements OnInit {

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
