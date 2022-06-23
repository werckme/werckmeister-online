import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IStyleFile, IStyleFileInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';
import { AWorkspacePlayerComponent, ICompilerError, PlayerState } from '../online-editor/AWorkspacePlayerComponent';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { text as mainSheetText } from './main.sheet';
import { text as pitchmapText } from './myPitchmap.pitchmap';
import { text as chordsText } from './default.chords';
import { waitAsync } from 'src/shared/help/waitAsync';
import { IWorkspace, IFile, WorkspaceStorageService } from '../../services/workspaceStorage';
import { Router } from '@angular/router';

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
	public selectedGenre: string;
	public styles: Styles = {}
	private workspaceModel: WizzardWorkspace = new WizzardWorkspace();

	@ViewChild("workspace", { read: ViewContainerRef }) workspaceEl: ViewContainerRef;
	@ViewChild("chords", { read: ViewContainerRef }) chords: ViewContainerRef;
	constructor(private service: WizzardService, 
		notification: NzNotificationService, 
		private router: Router, 
		private workspaceService: WorkspaceStorageService) {
		super(notification);
	}

	async ngAfterViewInit(): Promise<void> {
		this.initWorkspace();
		const templates = await this.service.getStyles();
		this.styles = _(templates)
			.groupBy(x => x.metaData.title)
			.value();
		await waitAsync(10);
		this.selectedGenre = _(this.styles).keys().sort().first();
		this.switchGenre(this.selectedGenre);
	}


	protected onCompilerError(error: ICompilerError): void {
		this.notification.error("", error.errorMessage)
	}

	private async clearWorkspace(): Promise<void> {
		for(const workspaceFile of this.workspaceModel.files) {
			await this.workspaceComponent.removeFile(workspaceFile.path);
		}
		this.workspaceModel = new WizzardWorkspace();
	}

	public async switchGenre(style: string): Promise<void> {
		try {
			await this.workspaceComponent.stop();
			const styleFileInfos = this.styles[style];
			const addFile = async (path: string, data: string) => {
				this.workspaceModel.files.push({path, data});
				await this.workspaceComponent.addFile(path, data);
			};
			await this.clearWorkspace();
			for(const styleFileInfo of styleFileInfos) {
				const file = await this.service.getStyleFile(styleFileInfo.id);
				this.workspaceModel.styleInfos.push(styleFileInfo);
				await addFile(file.id, file.data);
			}
			await addFile("myPitchmap.pitchmap", pitchmapText);
			await addFile("default.chords", chordsText);
		} catch {
			this.notification.error("", `failed to fetch style infos`);
		}
	}

	private getInstrumentConfParams(styleInfo: IStyleFileInfo) {
		const hasDefInfo = styleInfo.metaData.instrumentDef;
		const instrumentName = styleInfo.metaData.instrument;
		return hasDefInfo ? `${instrumentName} ${styleInfo.metaData.instrumentDef}` : `${instrumentName} _pc=0`;
	}

	private getInstrumentDefParams(styleInfo: IStyleFileInfo) {
		return styleInfo.metaData.instrumentConf || `${styleInfo.metaData.instrument} volume 100`;
	}

	private createInstruments(): string[] {
		const result:string[] = []
		let midiChannel = 0;
		for(const styleInfo of this.workspaceModel.styleInfos) {
			const isDrums = styleInfo.metaData.instrument === 'drums';
			const instrumentChannel = isDrums ? 9 : midiChannel++;
			const instrumentDef = `instrumentDef: ${this.getInstrumentConfParams(styleInfo)} _onDevice="MyDevice" _ch=${instrumentChannel};`;
			const instrumentConf = `instrumentConf: ${this.getInstrumentDefParams(styleInfo)};`;
			result.push(instrumentDef, instrumentConf);
		}
		return result;
	}

	public createMainSheet(): string {
		const styleInfo = _.first(this.workspaceModel.styleInfos);
		if (!styleInfo) {
			return;
		}
		const usings = this.workspaceModel.files.map(x => `using "./${x.path}";`)
		const templates = this.workspaceModel.styleInfos.map(x => x.metaData).map(x => `${x.instrument}.${x.title}.normal`)
		const instruments = this.createInstruments();
		const sheetText = mainSheetText
			.replace(/\$TEMPLATES/g, `/template: ${templates.join('\n\t')}\n\t/`)
			.replace(/\$USINGS/g, usings.join('\n'))
			.replace(/\$TEMPO/g, (styleInfo.metaData.tempo || 120).toString())
			.replace(/\$CHORDS/g, this.chords.element.nativeElement.value)
			.replace(/\$INSTRUMENTS/g, instruments.join("\n"));
		return sheetText;
	}

	public async createProject(): Promise<void> {
		const sheetText = this.createMainSheet();
		this.workspaceModel.files.push({path: "main.sheet", data: sheetText});
		const request = {
			wid: null,
			files: this.workspaceModel.files
		};
		const response = await this.workspaceService.updateWorkspace(request);
		this.router.navigate(['/editor'], {queryParams: {wid: response.wid}});
	}

	public async play(): Promise<void> {
		const text = this.createMainSheet();
		await this.workspaceComponent.addFile("main.sheet", text);
		this.workspaceComponent.play();
	}
}
