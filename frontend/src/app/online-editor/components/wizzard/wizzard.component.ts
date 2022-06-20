import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IStyleFile, IStyleFileInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';
import { AWorkspacePlayerComponent, ICompilerError, PlayerState } from '../online-editor/AWorkspacePlayerComponent';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { text as mainSheetText } from './main.sheet';
import { text as pitchmapText } from './myPitchmap.pitchmap';
import { text as chordsText } from './default.chords';
import { waitAsync } from 'src/shared/help/waitAsync';
import { IWorkspace, IFile } from '../../services/workspaceStorage';

type Styles = { [key: string]: IStyleFileInfo[] };

class WizzardWorkspace implements IWorkspace {
	wid: string;
	files: IFile[] = [];
	styleInfos: IStyleFileInfo[] = [];
}

@Component({
	selector: 'app-wizzard',
	templateUrl: './wizzard.component.html',
	styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent extends AWorkspacePlayerComponent implements AfterViewInit {
	public selectedStyleTemplates: IStyleFileInfo[]; 
	public styles: Styles = {}
	private currenWorkspace: WizzardWorkspace = new WizzardWorkspace();

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
		const styleInfo = _.first(this.currenWorkspace.styleInfos);
		if (!styleInfo) {
			return;
		}
		const usings = this.currenWorkspace.files.map(x => `using "./${x.path}";`)
		const templates = this.currenWorkspace.styleInfos.map(x => x.metaData).map(x => `${x.instrument}.${x.title}.normal`)
		const sheetText = mainSheetText
			.replace(/\$TEMPLATES/g, `/template: ${templates.join('\n\t')}/`)
			.replace(/\$USINGS/g, usings.join('\n'))
			.replace(/\$TEMPO/g, (styleInfo.metaData.tempo || 120).toString());
		this.editor.element.nativeElement.setScriptText(sheetText);
	}

	protected onCompilerError(error: ICompilerError): void {
		this.notification.error("", error.errorMessage)
	}

	private async clearWorkspace(): Promise<void> {
		for(const workspaceFile of this.currenWorkspace.files) {
			await this.workspaceComponent.removeFile(workspaceFile.path);
		}
		this.currenWorkspace = new WizzardWorkspace();
	}

	public async onStyleSelected(styleFileInfos: IStyleFileInfo[]): Promise<void> {
		const addFile = async (path: string, data: string) => {
			this.currenWorkspace.files.push({path, data});
			await this.workspaceComponent.addFile(path, data);
		};
		await this.clearWorkspace();
		for(const styleFileInfo of styleFileInfos) {
			const file = await this.service.getStyleFile(styleFileInfo.id);
			this.currenWorkspace.styleInfos.push(styleFileInfo);
			await addFile(file.id, file.data);
		}
		await addFile("myPitchmap.pitchmap", pitchmapText);
		await addFile("default.chords", chordsText);
		this.updateSheet();
	}

}
