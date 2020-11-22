import { Injectable, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LogService } from './log.service';
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
		           protected router: Router) {
	}

	
	setTitle(title: string) {
		this.title.setTitle(title);
	}
}
