import { Component, OnInit } from '@angular/core';
import { ATutorial } from '../../ATutorial';
import { Router } from '@angular/router';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';

@Component({
  selector: 'app-voicings',
  templateUrl: './voicings.component.html',
  styleUrls: ['./voicings.component.scss']
})
export class VoicingsComponent extends ATutorial implements OnInit {

	files: IFile[];
	constructor(route: Router, werck: WerckService) { 
		super(route, werck);
	}

	ngOnInit() {
	}

}
