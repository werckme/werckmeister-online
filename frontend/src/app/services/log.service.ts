import { Injectable, EventEmitter } from '@angular/core';
import { ILogger } from 'src/shared/io/logger';
import { BackendService } from './backend.service';

export enum LogType {
	Error,
	Info,
	Warning
}

export class LogEntry {
	datetime: Date;
	constructor(public type: LogType, public text: string) {
		this.datetime = new Date();
	}
}

@Injectable({
	providedIn: 'root'
})
export class LogService implements ILogger {
	logHandler = new EventEmitter<LogEntry>();
	onError = new EventEmitter<string>();
	onWriteToConsole = new EventEmitter<string>();
	constructor(protected backend: BackendService) { 
		this.backend.logger = this;
	}

	error(msg: string) {
		this.logHandler.emit(new LogEntry(LogType.Error, msg));
		this.onError.emit(msg);
	}

	warn(msg: string) {
		this.logHandler.emit(new LogEntry(LogType.Warning, msg));
	}

	info(msg: string) {
		this.logHandler.emit(new LogEntry(LogType.Info, msg));
	}

	writeToConsole(text: string) {
		this.onWriteToConsole.emit(text);
	}
	
}
