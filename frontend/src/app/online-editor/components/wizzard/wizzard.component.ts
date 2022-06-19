import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IStyleFile, IStyleFileInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';
import { AWorkspacePlayerComponent, ICompilerError, PlayerState } from '../online-editor/AWorkspacePlayerComponent';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { text as mainSheetText } from './main.sheet';
import { text as pitchmapText } from './myPitchmap.pitchmap';
import { text as chordsText } from './default.chords';
import { waitAsync } from 'src/shared/help/waitAsync';

type Styles = { [key: string]: IStyleFileInfo[] };

@Component({
	selector: 'app-wizzard',
	templateUrl: './wizzard.component.html',
	styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent extends AWorkspacePlayerComponent implements AfterViewInit {
	public selectedStyleTemplates: IStyleFileInfo[]; 
	public styles: Styles = {}
	private currentStyleFiles: {file:IStyleFile, info: IStyleFileInfo}[] = [];
	@ViewChild("workspace", { read: ViewContainerRef }) workspaceEl: ViewContainerRef;
	@ViewChild("editor", { read: ViewContainerRef }) editor: ViewContainerRef;
	constructor(private service: WizzardService, notification: NzNotificationService) {
		super(notification);
	}

	async ngAfterViewInit(): Promise<void> {
		this.initWorkspace();
		const templates = await this.service.getStyles();
		this.styles = _(templates)
			.groupBy(x => x.metaData.title)
			.value();
		const workspaceNEl = this.workspaceComponent;
		workspaceNEl.registerEditor(this.editor.element.nativeElement);
		await waitAsync(10);
		this.updateSheet();
	}

	private updateSheet(): void {
		const styleInfo = _.first(this.currentStyleFiles)?.info;
		if (!styleInfo) {
			return;
		}
		const usings = this.currentStyleFiles.map(x => `using "./${x.file.id}";`)
		const templates = this.currentStyleFiles.map(x => x.info.metaData).map(x => `${x.instrument}.${x.title}.normal`)
		const sheetText = mainSheetText
			.replace(/\$TEMPLATES/g, `/template: ${templates.join('\n')}/`)
			.replace(/\$USINGS/g, usings.join('\n'))
			.replace(/\$TEMPO/g, (styleInfo.metaData.tempo || 120).toString());
		this.editor.element.nativeElement.setScriptText(sheetText);
	}

	protected onCompilerError(error: ICompilerError): void {
		this.notification.error("", error.errorMessage)
	}

	private async clearWorkspace(): Promise<void> {
		this.currentStyleFiles = [];
		for(const styleFile of this.currentStyleFiles) {
			await this.workspaceComponent.removeFile(styleFile.file.id);
		}
	}

	public async onStyleSelected(styleFiles: IStyleFileInfo[]): Promise<void> {
		await this.clearWorkspace();
		for(const styleFile of styleFiles) {
			const file = await this.service.getStyleFile(styleFile.id);
			this.currentStyleFiles.push({file, info: styleFile});
			await this.workspaceComponent.addFile(file.id, file.data);
		}
		await this.workspaceComponent.addFile("myPitchmap.pitchmap", pitchmapText);
		await this.workspaceComponent.addFile("default.chords", chordsText);
		this.updateSheet();
	}

}
