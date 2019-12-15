import { Component, OnInit } from '@angular/core';
import { IFile } from 'src/shared/io/file';
import { BackendService, MidiDeviceInfo } from 'src/app/services/backend.service';
import { WerckService } from 'src/app/services/werck.service';
import { AppConfig } from 'src/config';
import { IExpressionDef, werckmeisterExpressions } from 'src/shared/help/expressionDefs';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { SheetInspector } from 'src/shared/editor/SheetInspector';
import { IEditorViewModel } from 'src/app/components/partials/editor/viewmodels/IEditor.model';


const snippet = 
`
--        name    type  port nr.
device: MyDevice  midi    $PORTNR;







instrumentDef: piano  MyDevice  2 0 0;
[
instrument: piano;
{
    <c e g>1  |
}
]

`
;

const bar = ``;


@Component({
	selector: 'app-first-steps',
	templateUrl: './midi-config.component.html',
	styleUrls: ['./midi-config.component.scss']
})
export class MidiConfigComponent extends ATutorial implements OnInit {
	snippetViewModel: IEditorViewModel;
	files: IFile[] = [];
	devices: MidiDeviceInfo[];
	deviceDev: IExpressionDef = werckmeisterExpressions.setup.content.device;
	constructor(werck: WerckService, route: Router, protected backend: BackendService) {
		super(route, werck);
	}

	redirectToMidiConfigIfNeccessary() {}

	async ngOnInit() {
		let text = this.prepareSnippet(snippet);
		this.files = [await this.werck.createTutorialFile(text)];
	}

	getMidiPortnumber(): number {
		if (!this.snippetViewModel) {
			return 0;
		}
		let inspector = new SheetInspector(this.snippetViewModel.editor)
		let midiConfigs = inspector.getMidiConfigs();
		if (!midiConfigs || midiConfigs.length === 0) {
			return 0;
		}
		return midiConfigs[0].port;
	}

	async goto(url:string) {
		AppConfig.Tutorial.defaultMidiPort = this.getMidiPortnumber();
		super.goto(url);
    }
}
