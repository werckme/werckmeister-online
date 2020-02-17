import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, ContentChild } from '@angular/core';
import { IFile, UndefinedSourceId } from 'src/shared/io/file';
import { WerckService } from 'src/app/services/werck.service';
import { FileService } from 'src/app/services/file.service';
import { IEditorViewModel } from '../../editor/viewmodels/IEditor.model';
import { BackendService } from 'src/app/services/backend.service';
import { WmcodeDirective } from 'src/app/directives/wmcode.directive';

@Component({
	selector: 'tutorialsnippet',
	templateUrl: './tutorialsnippet.component.html',
	styleUrls: ['./tutorialsnippet.component.scss']
})
export class TutorialsnippetComponent implements OnInit, AfterViewInit {
	
	file: IFile;

	@Input()
	lineOffset: number;

	@Input()
	lineHeight: number = 10;

	@Input()
	justSnippet = false;

	@Input()
	stitle = 'LIVE Action™ Snippet';

	@Output()
	onEditorViewModelChange = new EventEmitter<IEditorViewModel>();

	@Output()
	isReady = new  EventEmitter<void>();

	@ContentChild(WmcodeDirective) wmCode: WmcodeDirective;

	get isPlaying(): boolean {
		return this.werck.isPlaying && this.werck.mainSheet.sourceId === this.file.sourceId;
	}

	constructor(public werck: WerckService, protected backend: BackendService, protected files: FileService) { 
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.createFile(this.wmCode.source).then((file)=>{
			this.file = file;
		});
	}

	private async createFile(text: string): Promise<IFile> {
		const file = await this.werck.createTutorialFile(text);
		return file;
	}

	async play(mouseEvent: MouseEvent) {
		if (this.werck.isPlaying) {
			await this.werck.stop();
		}
		await this.werck.setSheet(this.file);
		this.werck.play(mouseEvent);
	}

	async stop() {
		await this.werck.stop();
	}

	_onEditorViewModelChange(vm: IEditorViewModel) {
		this.onEditorViewModelChange.emit(vm);
	}

	_onIsReady() {
		this.isReady.emit();
	}
}
