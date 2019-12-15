import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';

@Component({
	selector: 'app-pitchmap',
	templateUrl: './pitchmap.component.html',
	styleUrls: ['./pitchmap.component.scss']
})
export class PitchmapComponent extends ATutorial implements OnInit {

	files: IFile[];
	constructor(route: Router, werck: WerckService) { 
		super(route, werck);
	}

	ngOnInit() {
	}

}
