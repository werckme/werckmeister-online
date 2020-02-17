import { Component, OnInit, ElementRef } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-manual',
	templateUrl: './manual.html',
	styleUrls: []
})
export class ManualComponent extends AAutoSideMenu implements OnInit {
	constructor(elRef:ElementRef, app: AppService) {
		super(elRef, app);
	}

	ngOnInit() {
	}
}
