import { Injectable, EventEmitter } from '@angular/core';
import { BackendService } from './backend.service';
import { IFile, FileType, getFileTypeForExtension, ExtensionMap, getExtension, AFile } from 'src/shared/io/file';
import { SaveFileDialog, FileDialogOptions} from 'src/shared/io/fileDialog';
import { Path } from 'src/shared/werck/types';

@Injectable({
	providedIn: 'root'
}) 
export class FileService {

	fileSaved = new EventEmitter<IFile>();
	constructor(private backend: BackendService) { 

	}

	async loadContent(file: IFile) { 
		let fileWithContent = await this.backend.editorLoadFile(file.path);
		file.content = fileWithContent.content;
	}

	async findPathFor(obj: IFile | FileType, title:string = null): Promise<Path> {
			let ext = '';
			let type: FileType = null;
			if (!!(obj as IFile).extension) {
				ext = (obj as IFile).extension;
				type = getFileTypeForExtension(ext);
			} else {
				type = obj as FileType;
				ext = ExtensionMap[type];
			}
			if (!type) {
				return;
			}
			title = `Save ${type}`;
			let dlg = new SaveFileDialog(this.backend);
			let options = new FileDialogOptions();
			options.title = title;
			options.filetypes = [type];
			let path:Path = await dlg.show(options);
			if (!path) {
				return;
			}
			if (!!ext && getExtension(path) !== ext) {
				path += ext;
			}
			return path;
	}

	async save(file: IFile): Promise<void> {
		if (!file.hasContent) {
			return new Promise((resolve, reject) => {
				reject(new Error(`file: ${file.sourceId} has no content`));
			});
		}
		if (file.isNew) {
			file.path = await this.findPathFor(file);
			if (!file.path) {
				return;
			}
		}
		else if (file.content && !file.content.changed) {
			return;
		}
		await this.backend.werckSaveFile(file);
		this.fileSaved.emit(file);
	}

	async createNewFile(path: Path, fileType: FileType): Promise<IFile> {
		let file = await this.backend.appCreateNewFile(path, fileType);
		return file;
	}
}
