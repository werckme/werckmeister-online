import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';
import { AnchorScrollSpy } from 'src/shared/VanillaJs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-manual',
	templateUrl: './manual.html',
	styleUrls: ['manual.scss']
})
export class ManualComponent extends AAutoSideMenu implements OnInit, AfterViewInit {
	scrollSpy: AnchorScrollSpy;
	constructor(elRef:ElementRef, app: AppService, private router: Router) {
		super(elRef, app);
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.scrollSpy = new AnchorScrollSpy(this.elRef.nativeElement);
		this.scrollSpy.onScrolledToAnchor = this.onScrolledToAnchor.bind(this);
	}

	onScrolledToAnchor(anchor: Element) {

	}
}
