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
	instruments: IStyleFileInfo[] = [];
}

@Component({
	selector: 'app-wizzard',
	templateUrl: './wizzard.component.html',
	styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent extends AWorkspacePlayerComponent implements AfterViewInit {
	public selectedGenre: string;
	public styles: Styles = {}
	public allStyleFileInfos: IStyleFileInfo[];
	public workspaceModel: WizzardWorkspace = new WizzardWorkspace();

	public styleComparer(a: IStyleFileInfo, b: IStyleFileInfo): boolean {
		if (!a || !b) {
			return false;
		}
		return a.id === b.id;
	}

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
		this.allStyleFileInfos = await this.service.getStyles();
		this.styles = _(this.allStyleFileInfos)
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
				this.workspaceModel.instruments.push(styleFileInfo);
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
		for(const styleInfo of this.workspaceModel.instruments) {
			const isDrums = styleInfo.metaData.instrument === 'drums';
			const instrumentChannel = isDrums ? 9 : midiChannel++;
			const instrumentDef = `instrumentDef: ${this.getInstrumentConfParams(styleInfo)} _onDevice="MyDevice" _ch=${instrumentChannel};`;
			const instrumentConf = `instrumentConf: ${this.getInstrumentDefParams(styleInfo)};`;
			result.push(instrumentDef, instrumentConf);
		}
		return result;
	}

	public createMainSheet(): string {
		const styleInfo = _.first(this.workspaceModel.instruments);
		if (!styleInfo) {
			return;
		}
		const usings = this.workspaceModel.files.map(x => `using "./${x.path}";`)
		const templates = this.workspaceModel.instruments.map(x => x.metaData).map(x => `${x.instrument}.${x.title}.normal`)
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

	public findInstuments(instrument: string) {
		return this.allStyleFileInfos
			.filter(x => x.id.startsWith(instrument));
	}

	public async play(): Promise<void> {
		const text = this.createMainSheet();
		await this.workspaceComponent.addFile("main.sheet", text);
		this.workspaceComponent.play();
	}

	public async stop(): Promise<void> {
		await this.workspaceComponent.stop();
	}

	public async instrumentChange(newInstrument: IStyleFileInfo, instrumentIndex: number): Promise<void> {
		const oldInstrument = this.workspaceModel.instruments[instrumentIndex];
		await this.workspaceComponent.removeFile(oldInstrument.id);
		this.workspaceModel.files = this.workspaceModel.files.filter(x => x.path !== oldInstrument.id);
		const file = await this.service.getStyleFile(newInstrument.id);
		await this.workspaceComponent.addFile(file.id, file.data);
		this.workspaceModel.files.push({path: file.id, data: file.data});
		this.workspaceModel.instruments[instrumentIndex] = newInstrument;
	}
}
