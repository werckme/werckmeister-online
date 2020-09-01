import { Injectable, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackendService } from './backend.service';
import { IEditorViewModel } from '../components/partials/editor/viewmodels/IEditor.model';
import { WerckService } from './werck.service';
import { LogService } from './log.service';
import { ShortcutService } from './shortcut.service';
import { FileService } from './file.service';
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
	currentEditor: IEditorViewModel;
	version: string;
	sideMenuItems: SideMenuItem[] = [];

	constructor(protected title: Title, 
		           protected backend: BackendService, 
		           protected log: LogService,
		           protected werck: WerckService,
		           protected shortcuts: ShortcutService,
		           protected file: FileService,
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
