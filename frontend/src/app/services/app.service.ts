import { Injectable, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackendService, ConfigResult } from './backend.service';
import { IEditorViewModel } from '../components/partials/editor/viewmodels/IEditor.model';
import { OpenFileDialog, FileDialogOptions } from 'src/shared/io/fileDialog';
import { Path } from 'src/shared/werck/types';
import { WerckService } from './werck.service';
import { LogService } from './log.service';
import { ShortcutService } from './shortcut.service';
import { FileService } from './file.service';
import { IFile, FileType, ExtensionMap } from 'src/shared/io/file';
import { SheetInspector } from 'src/shared/editor/SheetInspector';
import { EditorSheetViewModel } from '../components/partials/editor/viewmodels/sheet.model';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { SnippetTemplateTrack, SnippetSheetTrack, SnippetNotationTrack, SnippetInstrument } from 'src/shared/werck/snippets';
const ResourceFiles = [FileType.Template, FileType.Chords, FileType.Pitchmap, FileType.Lua];



@Injectable({
	providedIn: 'root'
})
export class AppService {
	onBoundsChanged = new EventEmitter<void>();
	currentEditor: IEditorViewModel;
	version: string;
	private currentFile_: IFile;
	constructor(protected title: Title, 
		protected backend: BackendService, 
		protected log: LogService,
		protected werck: WerckService,
		protected shortcuts: ShortcutService,
		protected file: FileService,
		protected router: Router) {
		this.backend.appGetConfig().then((config:ConfigResult) => {
			this.version = config.version;
		});
		this.initShortcuts();
		this.werck.onTryPlayWithoutSheet.subscribe({ next: this.onTryPlayWithoutSheet.bind(this) });
		router.events.subscribe(() => {
			let main = $(".main-container");
			main.scrollTop();
		});
	}

	get canEdit(): boolean {
		return !!this.currentFile;
	}

	get currentFile(): IFile {
		return this.currentFile_;
	}

	set currentFile(val: IFile) {
		this.setTitle(val.filename);
		this.currentFile_ = val;
		this.openEditor();
	}

	currentFileIs(fileType: FileType) {
		return this.currentFile && this.currentFile.extension === ExtensionMap[fileType];
	}

	get currentFileIsSheet(): boolean {
		return this.currentFileIs(FileType.Sheet);
	}

	initShortcuts() {
		this.shortcuts.when().altAndChar('p').thenExecute(() => {
			this.togglePlay();
		});
		this.shortcuts.when().ctrlAndChar('s').thenExecute(() => {
			this.save();
		});
	}

	togglePlay() {
		if (this.werck.isPlaying) {
			this.werck.stop();
		} else {
			this.werck.play();
		}
	}

	setTitle(title: string) {
		this.title.setTitle(title);
	}

	boundsChanged() {
		this.onBoundsChanged.emit();
	}

	async openLink(_url: string) {
		let url = new URL(_url);
		if (url.protocol === "http:" || url.protocol === "https:") {
			this.backend.appOpenLink(url.href);
		}
		if (url.protocol === "werck:") {
			let route = url.pathname.replace('/', ''); // remove first /
			this.router.navigateByUrl(route);
		}
		if (url.protocol === "tutorial:") {
			let path = './tutorial' + url.pathname.replace('/', ''); // remove first /
			this.currentFile = await this.werck.openSheet(path);
			this.openEditor();
		}
	}

	async gotoTutorial() {
		if (this.currentFile) {
			await this.werck.closeSheet();
		}
		this.router.navigate(['/help/tutorial/midiconfig']); 
	}

	async closeTutorial() {
		await this.werck.closeSheet();
		if (!this.currentFile) {
			this.router.navigate(['/']); 
			return;
		}
		this.currentFile = await this.werck.openSheet(this.currentFile.path)
		this.router.navigate(['/editor']); 
	}

	get isTutorialOpen(): boolean {
		return this.router.url.indexOf('/help/tutorial') >= 0;
	}

	openEditor() {
		this.router.navigateByUrl("/editor");
	}

	// main menu
	async newSheet() {
		this.currentFile = await this.werck.createNewSheet();
		this.openEditor();
	}

	async addNewResource(filetype: FileType) {
		let path = await this.file.findPathFor(filetype);
		if (!path) {
			return;
		}
		await this.file.createNewFile(path, filetype);
		this.addLoadExpression(path);
	}

	newTemplate() {
		this.addNewResource(FileType.Template);
	}

	async newChordDef() {
		this.addNewResource(FileType.Chords);
	}

	async newPitchmap() {
		this.addNewResource(FileType.Pitchmap);
	}

	async openSheet() {
		let dlg = new OpenFileDialog(this.backend);
		let options = new FileDialogOptions();
		options.title = "Find Sheet";
		options.filetypes = [FileType.Sheet];
		let path:Path = await dlg.show(options);
		if (!path) {
			return;
		}
		this.currentFile = await this.werck.openSheet(path);
		this.openEditor();
	}

	undo() {
		if (!this.currentEditor) {
			return;
		}
		this.currentEditor.editor.undo();
	}

	redo() {
		if (!this.currentEditor) {
			return;
		}
		this.currentEditor.editor.redo();
	}

	exit() {
		this.backend.appExit();
	}

	toggleLineComment() {
		this.currentEditor.toggleSelectedLineComment();
	}

	async save() {
		if (!this.currentFile) {
			return;
		}
		await this.file.save(this.currentFile);
	}

	async exportMidi() {
		let path = await this.file.findPathFor(FileType.Midi, "Export Midi");
		await this.backend.werckExportMidi(path);
	}

	async onTryPlayWithoutSheet() {
		await this.file.save(this.currentFile);
		if (!this.currentFile.isNew) {
			this.werck.play();
		}
	}

	async includeResource() {
		if (!this.currentFileIsSheet) {
			return;
		}
		let path = await this.openFileDlg("Find Resource", ResourceFiles);
		if (!path) {
			return;
		}
		this.addLoadExpression(path);
	}

	private selectAfterInsert(row, line) {
		let range = this.currentEditor.editor.createRange(row, 0, row, line.length);
		this.currentEditor.editor.select(range);
		this.currentEditor.editor.scrollToLine(Math.max(row - 5, 0));
	}

	private async addLoadExpression(path: string) {
		if (!this.currentFile.isNew) {
			path = await this.backend.appGetRelativePath(this.currentFile, path);
		}
		let inspector = this.currentEditor.createInspector() as SheetInspector;
		let lastLoadExpression = inspector.getLastLoadExpression();
		let rowOfInterest = !!lastLoadExpression ? lastLoadExpression.row + 1 : 0;
		let line = `@load "${path}";`;
		await this.currentEditor.editor.insertLine(line, { row: rowOfInterest, column: 0 });
		this.selectAfterInsert(rowOfInterest, line);
		this.file.save(this.currentFile);
	}

	async listMidiDevices() {
		let devices = await this.backend.appGetMidiDevices();
		if (devices.outputs.length === 0) {
			this.log.writeToConsole("no devices found");
			return;
		}
		let outputs = devices.outputs.map(x=>`${x.id}\t|\t${x.name}`);
		this.log.writeToConsole(`
id\t|\toutput name
----|-----------------------------------------
${outputs.join('\n')}
		`);
	}

	private async openFileDlg(title: string, types: FileType[]): Promise<Path> {
		let dlg = new OpenFileDialog(this.backend);
		let options = new FileDialogOptions();
		options.title = title;
		options.filetypes = types;
		return await dlg.show(options);
	}


	async insertInstrument() {
		let inspector = this.currentEditor.createInspector() as SheetInspector;
		let lastLoadExpression = inspector.getLastDocumentMetaEvent();
		let rowOfInterest = !!lastLoadExpression ? lastLoadExpression.row + 1 : 0;
		let line = SnippetInstrument;
		await this.currentEditor.editor.insertLine(line, { row: rowOfInterest, column: 0 });
		let rowSelect = rowOfInterest + 1;
		this.selectAfterInsert(rowSelect, line);
	}

	private async insertTrack(snippet: string) {
		let inspector = this.currentEditor.createInspector() as SheetInspector;
		let lastLoadExpression = inspector.getLastTrack();
		let rowOfInterest = !!lastLoadExpression ? lastLoadExpression.row +1 : inspector.rows-1;
		let line = snippet;
		await this.currentEditor.editor.insertLine(line, { row: rowOfInterest, column: 0 });
		let rowSelect = rowOfInterest + 2;
		this.selectAfterInsert(rowSelect, line);
	} 
	insertNotationTrack() {
		this.insertTrack(SnippetNotationTrack);
	}

	insertTemplateTrack() {
		this.insertTrack(SnippetTemplateTrack);
	}

	insertSheetTrack() {
		this.insertTrack(SnippetSheetTrack);
	}
}
