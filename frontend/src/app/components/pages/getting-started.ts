import { Component, OnInit, ElementRef } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-getting-started',
	templateUrl: './getting-started.html',
	styleUrls: ['manual.scss']
})
export class GettingStartedComponent extends AAutoSideMenu implements OnInit {
	constructor(elRef:ElementRef, app: AppService) {
		super(elRef, app);
	}

	ngOnInit() {
	}
}
