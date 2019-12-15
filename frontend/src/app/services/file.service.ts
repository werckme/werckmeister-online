import { Injectable, EventEmitter } from '@angular/core';
import { BackendService } from './backend.service';
import { IFile } from 'src/shared/io/file';
@Injectable({
	providedIn: 'root'
}) 
export class FileService {

	fileSaved = new EventEmitter<IFile>();
	constructor(private backend: BackendService) { 

	}
}
