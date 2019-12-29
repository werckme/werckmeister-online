import { IFile, ITextFileContent } from 'src/shared/io/file';
import { IEditor, createNewEditor, IRange, IToken } from 'src/shared/editor/IEditor';
import { SheetEventMarkerManager } from 'src/shared/editor/gimmicks/sheetEventMarker';
import { BackendService } from 'src/app/services/backend.service';
import { AppService } from 'src/app/services/app.service';
import { WerckService, PlayerStateChange } from 'src/app/services/werck.service';
import { FileService } from 'src/app/services/file.service';
import * as _ from 'lodash';
import { AppConfig } from 'src/config';
import { EditorTextViewModel } from './text.model';
import { LogService } from 'src/app/services/log.service';
import { AInspector } from 'src/shared/editor/AInspector';
import { SheetInspector } from 'src/shared/editor/SheetInspector';
import { PlayerState } from 'src/shared/werck/player';

const ReIsComment = /^ *--.*$/;
const LineComment = "--  ";
const ReComment = /(^\s*)([^\s].*$)/;
const ReRemoveComment = /(^\s*)--\s*(.*$)/

export class EditorSheetViewModel extends EditorTextViewModel{
    editorMode: string = "sheet";
    file: IFile;
	editor: IEditor;
	markerManager: SheetEventMarkerManager;
	canCommentSelection: boolean = true;
	playerStateListener: any;
	constructor(protected backend: BackendService,
		protected log: LogService,
		protected werck: WerckService,
		protected fileService: FileService) {
		super(backend, log, werck, fileService);
	}

	onFileChanged(file: IFile) {
		super.onFileChanged(file);
		if (file.isNew) {
			return;
		}
		if (file.sourceId === this.file.sourceId) {
			this.updateEventMarkers();
		}
	}

	createInspector(): AInspector {
		return new SheetInspector(this.editor);
	}


	updateEventMarkers() {
		this.editor.clearMarkers();
		this.markerManager.updateEventMarkers();
	}


	async dettach(): Promise<void> {
		if(!!this.playerStateListener) {
			this.playerStateListener.unsubscribe();
		}
		if (this.markerManager && this.markerManager.isObserving) {
			this.markerManager.stopEventPositionHighlighter();
		}
		await super.dettach();
	}

	stopHighlighter() {
		this.markerManager.stopEventPositionHighlighter();
	}

	async startHighlighter() {
		if (!this.markerManager) {
			this.markerManager = new SheetEventMarkerManager(this.file, this.editor, this.werck);
			await this.markerManager.updateEventMarkers();
		}
		this.markerManager.startEventPositionHighlighter();
	}

	onPlayerStateChanged(state: PlayerStateChange) {
		if (this.werck.mainSheet.filename !== this.file.filename) {
			return;
		}
		if (state.from === PlayerState.Stopped && state.to === PlayerState.Playing) {
			this.startHighlighter();
		}
		if (state.from === PlayerState.Playing && state.to === PlayerState.Stopped) {
			this.stopHighlighter();
		}
	}

	async openSession() {
		super.openSession();
		this.playerStateListener = 
			this.werck
				.playerStateChange
				.subscribe({next: this.onPlayerStateChanged.bind(this)});
		if (this.werck.playerState === PlayerState.Playing) {
			this.startHighlighter();
		}
	}

	isLineCommented(line: string): boolean {
		return ReIsComment.test(line);
	}

	toggleLineComment(lineRange: IRange, line: string) {
		if (this.isLineCommented(line)) {
			let newLine = line.replace(ReRemoveComment, "$1$2");
			this.editor.replace(lineRange, newLine);
		} else {
			let newLine = line.replace(ReComment, `$1${LineComment}$2`);
			this.editor.replace(lineRange, newLine);
		}
	}
}