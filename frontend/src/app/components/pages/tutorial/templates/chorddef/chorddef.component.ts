import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';

@Component({
	selector: 'app-chorddef',
	templateUrl: './chorddef.component.html',
	styleUrls: ['./chorddef.component.scss']
})
export class ChordDefComponent extends ATutorial implements OnInit {

	files: IFile[];
	constructor(route: Router, werck: WerckService) { 
		super(route, werck);
	}

	ngOnInit() {
	}

}
