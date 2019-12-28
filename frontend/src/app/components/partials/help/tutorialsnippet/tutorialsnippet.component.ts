import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFile, UndefinedSourceId } from 'src/shared/io/file';
import { WerckService } from 'src/app/services/werck.service';
import { FileService } from 'src/app/services/file.service';
import { IEditorViewModel } from '../../editor/viewmodels/IEditor.model';
import { BackendService } from 'src/app/services/backend.service';

@Component({
	selector: 'tutorialsnippet',
	templateUrl: './tutorialsnippet.component.html',
	styleUrls: ['./tutorialsnippet.component.scss']
})
export class TutorialsnippetComponent implements OnInit {

	@Input()
	file: IFile;

	@Input()
	lineOffset: number;

	@Input()
	lineHeight: number;

	@Input()
	justSnippet = false;

	@Input()
	stitle = 'LIVE Action™ Snippet';

	@Output()
	onEditorViewModelChange = new EventEmitter<IEditorViewModel>();

	@Output()
	isReady = new  EventEmitter<void>();

	constructor(protected werck: WerckService, protected backend: BackendService, protected files: FileService) { }

	ngOnInit() {
	}

	async play(mouseEvent: MouseEvent) {
		await this.werck.setSheet(this.file);
		this.werck.play(mouseEvent);
	}

	_onEditorViewModelChange(vm: IEditorViewModel) {
		this.onEditorViewModelChange.emit(vm);
	}

	_onIsReady() {
		this.isReady.emit();
	}
}
