import { IFile } from 'src/shared/io/file';
import { IEditor, IRange, IMarker } from 'src/shared/editor/IEditor';
import { AInspector } from 'src/shared/editor/AInspector';
import { EventEmitter } from '@angular/core';

export interface IEditorViewModel {
    editorMode: string;
    file: IFile;
	editor: IEditor;
	canCommentSelection: boolean;
	isReady: EventEmitter<void>;
	toggleLineComment(lineRange: IRange, line: string);
	toggleSelectedLineComment();
	dettach(): Promise<void>;
	attach(elementId: string): Promise<void>;
	openSession(): Promise<void>;
	open(file: IFile): Promise<void>;
	createInspector(): AInspector;
	onDestroying(): void;
}