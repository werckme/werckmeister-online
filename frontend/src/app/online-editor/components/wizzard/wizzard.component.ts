import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ITemplate, ITemplateInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';
import { AWorkspacePlayerComponent, ICompilerError, PlayerState } from '../online-editor/AWorkspacePlayerComponent';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { text as mainSheetText } from './main.sheet';
import { waitAsync } from 'src/shared/help/waitAsync';

type Styles = { [key: string]: ITemplateInfo[] };

@Component({
	selector: 'app-wizzard',
	templateUrl: './wizzard.component.html',
	styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent extends AWorkspacePlayerComponent implements AfterViewInit {
	public styles: Styles = {}
	@ViewChild("workspace", { read: ViewContainerRef }) workspaceEl: ViewContainerRef;
	@ViewChild("editor", { read: ViewContainerRef }) editor: ViewContainerRef;
	constructor(private service: WizzardService, notification: NzNotificationService) {
		super(notification);
	}

	async ngAfterViewInit(): Promise<void> {
		this.initWorkspace();
		const templates = await this.service.getTemplates();
		this.styles = _(templates)
			.groupBy(x => x.metaData.title)
			.value();
		const workspaceNEl = this.workspaceComponent;
		workspaceNEl.registerEditor(this.editor.element.nativeElement);
		await waitAsync(10);
		this.editor.element.nativeElement.setScriptText(mainSheetText);
	}

	protected onCompilerError(error: ICompilerError) {
	}
	protected onWerckCompiled(document: any) {
	}

	protected onPlayerStateChanged(old: PlayerState, new_: PlayerState) {
		super.onPlayerStateChanged(old, new_);
	}

}
