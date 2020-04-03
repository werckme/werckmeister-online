import { Component, OnInit, ElementRef } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-code-extension',
	templateUrl: './visual-studio-code-extension.html',
	styleUrls: ['manual.scss']
})
export class CodeExtensionComponent extends AAutoSideMenu implements OnInit {
	constructor(elRef:ElementRef, app: AppService) {
		super(elRef, app);
	}

	ngOnInit() {
	}
}
