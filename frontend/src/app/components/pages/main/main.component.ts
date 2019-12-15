import { Component, OnInit } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut.service';
import { WerckService } from 'src/app/services/werck.service';
import { BackendService } from 'src/app/services/backend.service';
import { IFile } from 'src/shared/io/file';
import { AppService } from 'src/app/services/app.service';
import { FileService } from 'src/app/services/file.service';
import { Point, ObservablePoint } from 'src/shared/math/geomentry';
import { DomSanitizer } from '@angular/platform-browser';
import { LogService } from 'src/app/services/log.service';
import { Router } from '@angular/router';

const minBottomHeight = 50;
const bottomHeight = 150;
const sidebarWidth = 277;
const minSidebarWidth = 200;
const maxSidebarGapToRightBorder = 785;

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	tabs = {
		klavier: 0,
		console: 1
	};
	bottomTabIndex = this.tabs.klavier;
	bottomResizePos: Point;
	sidebarResizePos: Point;
	constructor(public werck: WerckService, 
		protected backend: BackendService,
		public app:AppService,
		protected fileService: FileService,
		protected log: LogService,
		private sanitizer: DomSanitizer,
		protected route: Router) { 
		this.log.onError.subscribe({ next: this.openTab.bind(this, this.tabs.console) });
		this.log.onWriteToConsole.subscribe({ next: this.openTab.bind(this, this.tabs.console) });
		this.initResizeHandler();
	}

	async ngOnInit() {
		this.printVersion();
		this.backend.appGetArgv().then(argv => {
			if (argv && argv.length >= 2) {
				setTimeout(async () =>{
					this.werck.openSheet(argv[1]);
				}, 100);
			}
		});
	}

	get gridStyle() {
		let grid = `grid-template-rows: 24px 50px auto ${this.bottomResizePos.y}px;`;
		grid += `grid-template-columns: ${this.sidebarResizePos.x}px auto;`;
		return this.sanitizer.bypassSecurityTrustStyle(grid);
	}

	initResizeHandler() {
		let bottomResizeHandlePoint = new ObservablePoint(0, bottomHeight);
		let sideBarResizeHandlePoint = new ObservablePoint(sidebarWidth, 0);
		sideBarResizeHandlePoint.onXChanged = (x:number) => {
			if (window.innerWidth - x <= maxSidebarGapToRightBorder) {
				return this.sidebarResizePos.x;
			} 
			this.app.boundsChanged();
			return Math.max(x, minSidebarWidth);
		};
		bottomResizeHandlePoint.onYChanged = (y:number) => {
			this.app.boundsChanged();
			return Math.max(y, minBottomHeight);
		};
		this.bottomResizePos = bottomResizeHandlePoint;
		this.sidebarResizePos = sideBarResizeHandlePoint;
	}

	openTab(tab: number) {
		this.bottomTabIndex = tab;
	}

	async printVersion() {
		let config = await this.backend.appGetConfig();
		console.log(config);
	}
}
