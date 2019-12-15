import { Component, OnInit } from '@angular/core';
import { IEditor, createNewEditor } from 'src/shared/editor/IEditor';
import { BackendService } from 'src/app/services/backend.service';
import * as moment from 'moment';
import { LogService, LogEntry, LogType } from 'src/app/services/log.service';
import { AppService } from 'src/app/services/app.service';
import * as _ from 'lodash';
let instances = 0;

@Component({
	selector: 'console',
	templateUrl: './console.component.html',
	styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
	elementId = `sheet-console-${instances++}`;
	editor: IEditor;
	private pileOfShame:Array<LogEntry> = [];
	constructor(protected backend: BackendService, protected logService: LogService, protected app: AppService) { 
		this.logService.logHandler.subscribe({next: this.log.bind(this)});
		this.logService.onWriteToConsole.subscribe({next: this.writeToConsole.bind(this)});
		let onBoundsChangedThrottled = _.throttle(this.onBoundsChanged.bind(this), 100);
		this.app.onBoundsChanged.subscribe({next: onBoundsChangedThrottled});
	}

	async ngOnInit() {
		await this.attach();
		this.printHello();
	}

	async printHello() {
		let version = (await this.backend.appGetConfig()).version;
		this.editor.insert(`Tach  M E I S T E R: ${version}\n`);
		this.handlePileOfShame();
	}

	private handlePileOfShame() {
		for(let message of this.pileOfShame) {
			this.log(message);
		}
		this.pileOfShame = [];
	}

	onBoundsChanged() {
		this.editor.onResize();
	}

	attach(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(async ()=>{
				let element = document.getElementById(this.elementId);
				this.editor = createNewEditor();
				await this.editor.attach(element);
				this.editor.setMode("console");
				this.editor.setTheme("clouds_midnight");
				setTimeout(resolve, 1000);
			});
		});
	}

	private logTimeToString(entry: LogEntry) {
		return moment(entry.datetime).format("HH:mm:ss");
	}

	writeToConsole(text: string) {
		this.editor.insert(text);
		let cursor = this.editor.getCursorPosition();
		this.editor.scrollToLine(cursor.row);
	}

	log(log: LogEntry) {
		if (!this.editor) {
			this.pileOfShame.push(log);
			return;
		}
		let typeText:string;
		switch(log.type) {
			case LogType.Error: typeText = "ERROR"; break;
			case LogType.Warning: typeText = "WARNING"; break;
			case LogType.Info:
			default: typeText = "INFO"; break;
		}
		this.writeToConsole(`[${typeText}] ${this.logTimeToString(log)} >> ${log.text}\n`);
	}
}
