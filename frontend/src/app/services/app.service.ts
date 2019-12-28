import { Injectable, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackendService } from './backend.service';
import { IEditorViewModel } from '../components/partials/editor/viewmodels/IEditor.model';
import { WerckService } from './werck.service';
import { LogService } from './log.service';
import { ShortcutService } from './shortcut.service';
import { FileService } from './file.service';
import { IFile } from 'src/shared/io/file';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Injectable({
	providedIn: 'root'
})
export class AppService {
	onBoundsChanged = new EventEmitter<void>();
	currentEditor: IEditorViewModel;
	version: string;
	constructor(protected title: Title, 
		           protected backend: BackendService, 
		           protected log: LogService,
		           protected werck: WerckService,
		           protected shortcuts: ShortcutService,
		           protected file: FileService,
		           protected router: Router) {
		router.events.subscribe(() => {
			const main = $('.main-container');
			main.scrollTop();
		});
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
		if (url.protocol === 'tutorial:') {
			// let path = './tutorial' + url.pathname.replace('/', ''); // remove first /
			// this.currentFile = await this.werck.openSheet(path);
			// this.openEditor();
		}
	}

	get isTutorialOpen(): boolean {
		return this.router.url.indexOf('/help/tutorial') >= 0;
	}
}
