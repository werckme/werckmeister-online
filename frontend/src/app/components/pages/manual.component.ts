import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AAutoSideMenu } from './AAutoSideMenu';
import { AppService } from 'src/app/services/app.service';
import { AnchorScrollSpy } from 'src/shared/VanillaJs';

@Component({
	selector: 'app-manual',
	templateUrl: './manual.html',
	styleUrls: ['manual.scss']
})
export class ManualComponent extends AAutoSideMenu implements OnInit, AfterViewInit, OnDestroy {
	scrollSpy: AnchorScrollSpy;
	constructor(elRef: ElementRef<HTMLLinkElement>, app: AppService) {
		super(elRef, app);
	}
	ngOnDestroy(): void {
		this.scrollSpy.unbind();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.scrollSpy = new AnchorScrollSpy(this.elRef.nativeElement);
		this.scrollSpy.onScrolledToAnchor = this.onScrolledToAnchor.bind(this);
	}

	onScrolledToAnchor(anchor: Element) {
		history.replaceState({}, null, `manual#${anchor.id}`);
	}
}
