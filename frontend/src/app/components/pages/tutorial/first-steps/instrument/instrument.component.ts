import { Component, OnInit } from '@angular/core';
import { IFile } from 'src/shared/io/file';
import { IExpressionDef, werckmeisterExpressions } from 'src/shared/help/expressionDefs';
import { WerckService } from 'src/app/services/werck.service';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { AppConfig } from 'src/config';


const snippet1 =
	`
device: MyDevice  midi $PORTNR;


--              name    device  ch cc pc
instrumentDef: piano  MyDevice   0  0  0;


instrumentConf: piano volume 100 pan 50;
[
instrument: piano;
{
    c4 d e f | g a b c' |
}
]

`
;

const snippet2 =
	`
device: MyDevice  midi $PORTNR;



instrumentDef: piano  MyDevice  0 0 0;


-- set the piano volume to 80 and the panning to left(0)
instrumentConf: piano volume 80 pan 0;


[
instrument: piano;
{
    c4 d e f | g a b c' |
}
]

`
;

@Component({
	selector: 'app-instrument',
	templateUrl: './instrument.component.html',
	styleUrls: ['./instrument.component.scss']
})
export class InstrumentComponent extends ATutorial implements OnInit {

	files: IFile[] = [];
	idef: IExpressionDef = werckmeisterExpressions.setup.content.instrumentDef;
	iconf: IExpressionDef = werckmeisterExpressions.setup.content.instrumentConf;
	constructor(werck: WerckService, route: Router) {
		super(route, werck);
	}

	async ngOnInit() {
		const text1 = this.prepareSnippet(snippet1);
		const text2 = this.prepareSnippet(snippet2);
		this.files = [await this.werck.createTutorialFile(text1), await this.werck.createTutorialFile(text2)];
	}

}
