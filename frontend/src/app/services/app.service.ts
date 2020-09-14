import { Injectable, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LogService } from './log.service';
import { ShortcutService } from './shortcut.service';
import { Router } from '@angular/router';

export class SideMenuItem {
	onClick = (ev: MouseEvent)=> {};
	constructor(public title=null) {}
}

@Injectable({
	providedIn: 'root'
})
export class AppService {
	onBoundsChanged = new EventEmitter<void>();
	version: string;
	sideMenuItems: SideMenuItem[] = [];

	constructor(protected title: Title, 
		           protected log: LogService,
		           protected shortcuts: ShortcutService,
		           protected router: Router) {
	}

	
	setTitle(title: string) {
		this.title.setTitle(title);
	}

	boundsChanged() {
		this.onBoundsChanged.emit();
	}

	async openLink(_url: string) {
		const url = new URL(_url);
		if (url.protocol === 'werck:') {
			const route = url.pathname.replace('/', ''); // remove first /
			this.router.navigateByUrl(route);
		}
	}

	get isTutorialOpen(): boolean {
		return this.router.url.indexOf('/help/tutorial') >= 0;
	}

	get isExamples(): boolean {
		return this.router.url.indexOf('/examples') >= 0;
	}
}
