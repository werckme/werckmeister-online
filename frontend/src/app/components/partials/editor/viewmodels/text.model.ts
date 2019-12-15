import { IFile, ITextFileContent } from 'src/shared/io/file';
import { IEditor, createNewEditor, IRange, IToken } from 'src/shared/editor/IEditor';
import { SheetEventMarkerManager } from 'src/shared/editor/gimmicks/sheetEventMarker';
import { BackendService } from 'src/app/services/backend.service';
import { AppService } from 'src/app/services/app.service';
import { WerckService } from 'src/app/services/werck.service';
import { FileService } from 'src/app/services/file.service';
import * as _ from 'lodash';
import { AppConfig } from 'src/config';
import { IEditorViewModel } from './IEditor.model';
import { LogService } from 'src/app/services/log.service';
import { AInspector } from 'src/shared/editor/AInspector';
import { TextInspector } from 'src/shared/editor/TextInspector';
import { EventEmitter } from '@angular/core';

export class EditorTextViewModel implements IEditorViewModel {
    editorMode: string = "text";
    file: IFile;
	editor: IEditor;
	canCommentSelection: boolean = false;
	textchangedDebounced: ()=>any;
	isReady = new EventEmitter<void>();
	constructor(protected backend: BackendService,
		protected log: LogService,
		protected werck: WerckService,
		protected fileService: FileService) {
		this.fileService.fileSaved.subscribe({next: this.onFileChanged.bind(this)});
	}
	
	isLineCommented(line: string): boolean {
		return false;
	}
	
	toggleLineComment(lineRange: IRange, line: string) {}
	
	toggleSelectedLineComment() {
		if (!this.canCommentSelection) {
			return;
		}
		let editor = this.editor;
		let selRange = editor.getSelection().getRange();
		let row = selRange.start.row;
		for(let line of editor.getLines(selRange.start.row, selRange.end.row))
		{
			let lineRange = editor.createRange(row, 0, row, line.length);
			this.toggleLineComment(lineRange, line);
			++row;
		}
	}

	createInspector(): AInspector {
		return new TextInspector(this.editor);
	}

    onFileChanged(file: IFile) {
    }

	onDestroying(): void {
	}

	async dettach(): Promise<void> {
        this.editor.offDocumentChanged(this.textchangedDebounced);
		await this.editor.detach();
	}

	onDocumentChanged() {
		(this.file.content as ITextFileContent).data = this.editor.getText();
	}

	onTokenClicked(token: IToken):void {}

	attach(elementId: string): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(async () => {
				let element = document.getElementById(elementId);
				if (!this.editor) {
					this.editor = createNewEditor();
				}
                await this.editor.attach(element);
                this.textchangedDebounced = _.debounce(this.onDocumentChanged.bind(this), AppConfig.EditorUpdateContentDebounceMillis);
				this.editor.onDocumentChanged(this.textchangedDebounced);
				this.editor.onTokenClicked.subscribe({ next: this.onTokenClicked.bind(this) });
				resolve();
				this.isReady.emit();
			});
		});
	}

	async openSession() {
	}

	async open(file: IFile) {
		this.file = file;
		try {
			if (!file.hasContent) {
				await this.fileService.loadContent(this.file); 
			}
		} catch (ex) {
			this.log.error(ex);
		}
		this.editor.setMode(this.editorMode);
		await this.editor.setText((this.file.content as ITextFileContent).data);
		this.editor.resetHistory();
		this.openSession();
	}
}