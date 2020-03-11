import { Component, OnInit, ElementRef } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-werckmeister',
	templateUrl: './werckmeister.html',
	styleUrls: ['werckmeister.scss']
})
export class WerckmeisterComponent extends AAutoSideMenu implements OnInit {
	constructor(elRef:ElementRef, app: AppService) { 
		super(elRef, app);
	}

	async ngOnInit() {
	}
}
