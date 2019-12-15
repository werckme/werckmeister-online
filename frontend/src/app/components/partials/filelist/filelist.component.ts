import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFile } from 'src/shared/io/file';


@Component({
	selector: 'filelist',
	templateUrl: './filelist.component.html',
	styleUrls: ['./filelist.component.scss']
})
export class FilelistComponent implements OnInit {

	@Input()
	files: IFile[];

	@Input()
	selectedFile: IFile;

	@Output()
	selectedFileChange = new EventEmitter<IFile>();

	constructor() { }

	ngOnInit() {
	}

	onSelectedFileChanged(file: IFile) {
		this.selectedFile = file;
		this.selectedFileChange.emit(file);
	}

	getIconClasses(file: IFile): string[] {
		let ext = file.extension.replace(".", "");
		return [ext];
	}
}
