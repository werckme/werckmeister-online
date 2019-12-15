import { Component, OnInit } from '@angular/core';
import { IFile } from 'src/shared/io/file';
import { BackendService, MidiDeviceInfo } from 'src/app/services/backend.service';
import { WerckService } from 'src/app/services/werck.service';
import { AppConfig } from 'src/config';
import { IExpressionDef, werckmeisterExpressions } from 'src/shared/help/expressionDefs';
import { Router } from '@angular/router';
import { SheetInspector } from 'src/shared/editor/SheetInspector';
import { IEditorViewModel } from 'src/app/components/partials/editor/viewmodels/IEditor.model';
import { MidiConfigComponent } from '../first-steps/midi/midi-config.component';

@Component({
	selector: 'selectmidi',
	templateUrl: './selectmidi.component.html',
	styleUrls: ['./selectmidi.component.scss']
})
export class SelectMidiComponent extends MidiConfigComponent implements OnInit {

	snippetViewModel: IEditorViewModel;
	files: IFile[] = [];
	devices: MidiDeviceInfo[];
	deviceDev: IExpressionDef = werckmeisterExpressions.setup.content.device;
	constructor(werck: WerckService, route: Router, backend: BackendService) {
		super(werck, route, backend);
	}
}
