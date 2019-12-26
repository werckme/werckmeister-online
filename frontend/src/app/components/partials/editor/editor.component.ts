import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { AppService } from 'src/app/services/app.service';
import { IFile } from 'src/shared/io/file';
import { WerckService } from 'src/app/services/werck.service';
import * as _ from 'lodash';
import { EditorSheetViewModel } from './viewmodels/sheet.model';
import { FileService } from 'src/app/services/file.service';
import { EditorTextViewModel } from './viewmodels/text.model';
import { EditorLuaViewModel } from './viewmodels/lua.model';
import { AppConfig } from 'src/config';
import { ShortcutService } from 'src/app/services/shortcut.service';
import { IEditorViewModel } from './viewmodels/IEditor.model';
import { EditorTutorialModel } from './viewmodels/tutorial.model';
import * as $ from 'jquery';
import { IToken } from 'src/shared/editor/IEditor';

let instances = 0;

@Component({
	selector: 'editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

	private file_: IFile;
	private fileViewModelMap = {};
	private currentModel_: IEditorViewModel;
	private line_: number;
	private lineHeight_: number;
	private onTokenClickedListener: any;
	get currentModel(): IEditorViewModel {
		return this.currentModel_;
	}

	set currentModel(val: IEditorViewModel) {
		this.currentModel_ = val;
		this.editorViewModelChange.emit(val);
	}
	
	async ngOnDestroy() {
		if (!this.editorReady) {
			return;
		}
		this.currentModel.onDestroying();
	}

	@Output()
	editorViewModelChange = new EventEmitter<IEditorViewModel>();
	
	@Output()
	isReady = new EventEmitter<void>();

	get file(): IFile {
		return this.file_;
	}
	@Input()
	set file(file: IFile) {
		let fileChanged = file !== this.file_;
		this.file_ = file;
		if (this.file_ && fileChanged) {
			this.open(file);
		}
	}

	@Input()
	set line(val: number) {
		this.line_ = val;
		if (this.editorReady) {
			this.currentModel.editor.scrollToLine(val);
		}
	}

	get line(): number {
		return this.line_;
	}

	@Input()
	set lineHeight(val: number) {
		this.lineHeight_ = val;
		if (this.editorReady) {
			this.setLineHeight_(val);
		}
	}

	get lineHeight(): number {
		return this.lineHeight_;
	}

	elementId = `sheet-ed-${instances++}`;
	constructor(protected backend: BackendService,
		protected app: AppService,
		protected werck: WerckService,
		protected fileService: FileService,
		protected shortcuts: ShortcutService) {
		let onBoundsChangedThrottled = _.throttle(this.onBoundsChanged.bind(this), 100);
		this.app.onBoundsChanged.subscribe({next: onBoundsChangedThrottled});
		this.werck.onCloseSheet.subscribe({next: this.onClosingSheet.bind(this)});
	}
	
	get editorReady(): boolean {
		return !!this.currentModel && !!this.currentModel.editor;
	}

	ngOnInit() {
		this.shortcuts
			.when()
			.shiftCtrlAndChar("/")
			.thenExecute(()=>{
				this.onCommentSelection();
			});
	}

	async onClosingSheet(file: IFile) {
		if (this.file.sourceId !== file.sourceId) {
			return;
		}
		this.fileViewModelMap = {};
		if (this.currentModel) {
			await this.currentModel.dettach();
		}
		this.currentModel = null;
	}

	onCommentSelection() {
		if (!this.editorReady) {
			return;
		}
		this.currentModel.toggleSelectedLineComment();
	}

	onBoundsChanged() {
		if (!this.editorReady) {
			return;
		}
		this.currentModel.editor.onResize();
	}

	private setLineHeight_(val: number) {
		$(`#${this.elementId}`).attr("style", `height: ${val}em`);
	}

	private createNewViewModel(file: IFile): IEditorViewModel {
		let CreateF = null;
		switch (file.extension) {
			case AppConfig.knownExtensions.template:
			case AppConfig.knownExtensions.sheet: CreateF = EditorSheetViewModel; break;
			case AppConfig.knownExtensions.lua: CreateF = EditorLuaViewModel; break;
			case AppConfig.knownExtensions.tutorial: CreateF = EditorTutorialModel; break;
			default: CreateF = EditorTextViewModel;
		}
		return new CreateF(this.backend, this.app, this.werck, this.fileService);
	}

	private getViewModel_(file: IFile): IEditorViewModel {
		let model = this.fileViewModelMap[file.sourceId];
		if (!model) {
			model = this.createNewViewModel(file);
			this.fileViewModelMap[file.sourceId] = model;
		}
		return model;
	}

	onTokenClicked(token: IToken):void {
		if (token.isType("link")) {
			this.app.openLink(token.value);
		}
	}

	addOnTokenClickedListener() {
		if (!!this.onTokenClickedListener) {
			this.onTokenClickedListener.unsubscribe();
		}
		this.onTokenClickedListener = this.currentModel
				.editor
				.onTokenClicked.subscribe({ next: this.onTokenClicked.bind(this) });
	}

	async open(file: IFile) {
		if (this.currentModel) {
			await this.currentModel.dettach();
		}
		this.currentModel = this.getViewModel_(file);
		let isNew = !this.currentModel.editor;
		this.setLineHeight_(this.lineHeight);
		await this.currentModel.attach(this.elementId);
		this.addOnTokenClickedListener();
		if (isNew) {
			this.currentModel.open(file);
		} else {
			this.currentModel.openSession();
		}
		if (this.line !== undefined) {
			setTimeout(()=>{
				this.currentModel.editor.scrollToLine(this.line);
			},100);
		}
		this.isReady.emit();
	}
}