import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IMetaData, IStyleFile, IStyleFileInfo, WizzardService } from 'src/app/services/wizzard.service';
import * as _ from 'lodash';
import { AWorkspacePlayerComponent, ICompilerError, PlayerState } from '../online-editor/AWorkspacePlayerComponent';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { text as mainSheetText } from './main.sheet';
import { text as pitchmapText } from './myPitchmap.pitchmap';
import { text as chordsText } from './default.chords';
import { waitAsync } from 'src/shared/help/waitAsync';
import { IWorkspace, IFile, WorkspaceStorageService } from '../../services/workspaceStorage';
import { Router } from '@angular/router';
import { FluidSynthGmDrums, GMInstruments } from '../../shared/GmInstruments';

type Styles = { [key: string]: StyleFileInfo[] };

class StyleFileInfo implements IStyleFileInfo {
	public get id(): string { return this.origin.id; }
	public get metaData(): IMetaData { return this.origin.metaData; }
	private get parsedPcStr(): string|null {
		const defStr: string = this.metaData.instrumentDef;
		const match = defStr.match(/_pc=(?<pc>\d+)/);
		return match?.groups?.pc ?? null;
	}
	public get pcNumber(): number {  
		const pc = this.parsedPcStr;
		if (pc === null) {
			return 0;
		}
		return Number.parseInt(pc);
	}
	public set pcNumber(newVal: number) {
		const currentPcStr = this.parsedPcStr;
		if (currentPcStr === null) {
			this.metaData.instrumentDef = (this.metaData.instrumentDef||'') + ` _pc=${newVal}`;
			return;
		}
		this.metaData.instrumentDef = this.metaData.instrumentDef.replace(/_pc=\d+/, `_pc=${newVal}`);
	}
	private get parsedVolumeStr(): string|null {
		const defStr: string = this.metaData.instrumentConfig;
		const match = defStr.match(/volume (?<vol>\d+)/);
		return match?.groups?.vol ?? null;
	}
	public get volNumber(): number {  
		const vol = this.parsedVolumeStr;
		if (vol === null) {
			return 100;
		}
		return Number.parseInt(vol);
	}
	public set volNumber(newVal: number) {
		const currentVolStr = this.parsedVolumeStr;
		if (currentVolStr === null) {
			this.metaData.instrumentConfig = (this.metaData.instrumentConfig||'') + ` volume ${newVal}`;
			return;
		}
		this.metaData.instrumentConfig = this.metaData.instrumentConfig.replace(/volume \d+/, `volume ${newVal}`);
	}
	constructor(private origin: IStyleFileInfo) {}
}

class WizzardWorkspace implements IWorkspace {
	wid: string;
	files: IFile[] = [];
	instruments: StyleFileInfo[] = [];
}

@Component({
	selector: 'app-wizzard',
	templateUrl: './wizzard.component.html',
	styleUrls: ['./wizzard.component.scss']
})
export class WizzardComponent extends AWorkspacePlayerComponent implements AfterViewInit {
	public selectedGenre: string;
	public styles: Styles = {}
	public allStyleFileInfos: StyleFileInfo[];
	public workspaceModel: WizzardWorkspace = new WizzardWorkspace();
	public gmInstruments = GMInstruments;
	public fluidSynthGmDrums = FluidSynthGmDrums;
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
		this.allStyleFileInfos = (await this.service.getStyles()).map(x => new StyleFileInfo(x));
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
		this.workspaceModel.files = [];
		await this.addFile("myPitchmap.pitchmap", pitchmapText);
		await this.addFile("default.chords", chordsText);
	}

	public async switchGenre(style: string): Promise<void> {
		try {
			this.workspaceModel = new WizzardWorkspace();
			await this.workspaceComponent.stop();
			const styleFileInfos = _.orderBy(this.styles[style], x => x.metaData.instrument);
			await this.clearWorkspace();
			for(const styleFileInfo of styleFileInfos) {
				const file = await this.service.getStyleFile(styleFileInfo.id);
				this.workspaceModel.instruments.push(styleFileInfo);
			}
		} catch {
			this.notification.error("", `failed to fetch style infos`);
		}
	}


	private async addFile(id: string, data: string):Promise<void> {
		await this.workspaceComponent.addFile(id, data);
		this.workspaceModel.files.push({path: id, data: data});
	}

	private async addStyleFile(file: IStyleFile):Promise<void> {
		this.addFile(file.id, file.data);
	}

	private async getStyleFileForInstrument(id: string, instrumentName: string): Promise<IStyleFile> {
		const file = await this.service.getStyleFile(id);
		const hasNumberPostfix:boolean = !!instrumentName.match(/.+\.\d+$/);
		if (hasNumberPostfix) {
			file.data = file.data.replace(/instrument:.*;/, `instrument: ${instrumentName};`);
		}
		return file;
	}

	private async addAuxFiles(instrumentDef: IStyleFileInfo): Promise<void> {
		if (!instrumentDef.metaData.auxFiles) {
			return;
		}
		for(const aux of instrumentDef.metaData.auxFiles) {
			await this.addFile(aux.path, aux.data);
		}
	}

	private async createInstruments(): Promise<string[]> {
		const result:string[] = []
		let midiChannel = 0;
		const usedInstruments = new Map<string, number>();
		const getNextInstrumentName = function(instrumentName: string) {
			let instrumentCount = 1;
			if (usedInstruments.has(instrumentName)) {
				instrumentCount = usedInstruments.get(instrumentName) + 1;
			}
			usedInstruments.set(instrumentName, instrumentCount);
			if (instrumentCount === 1) {
				return `${instrumentName}`;
			}
			return `${instrumentName}.${instrumentCount}`;
		}
		const getInstrumentDefParams = function(styleInfo: IStyleFileInfo, instrumentName: string) {
			const hasDefInfo = styleInfo.metaData.instrumentDef;
			return hasDefInfo ? `${instrumentName} ${styleInfo.metaData.instrumentDef}` : `${instrumentName} _pc=0`;
		}
		const getInstrumentConfigParams = function(styleInfo: IStyleFileInfo, instrumentName: string) {
			const hasConfInfo = styleInfo.metaData.instrumentConfig;
			return hasConfInfo ? `${instrumentName} ${styleInfo.metaData.instrumentConfig}` : `${styleInfo.metaData.instrument} volume 100`;
		}
		for(const styleInfo of this.workspaceModel.instruments) {
			const instrumentName = getNextInstrumentName(styleInfo.metaData.instrument);
			const file = await this.getStyleFileForInstrument(styleInfo.id, instrumentName);
			await this.addStyleFile(file);
			await this.addAuxFiles(styleInfo);
			const isDrums = styleInfo.metaData.instrument === 'drums';
			const instrumentChannel = isDrums ? 9 : midiChannel++;
			const instrumentDef = `instrumentDef: ${getInstrumentDefParams(styleInfo, instrumentName)} _onDevice="MyDevice" _ch=${instrumentChannel};`;
			const instrumentConf = `instrumentConf: ${getInstrumentConfigParams(styleInfo, instrumentName)};`;
			result.push(instrumentDef, instrumentConf);
		}
		return result;
	}

	public async createMainSheet(): Promise<string> {
		const styleInfo = _.first(this.workspaceModel.instruments);
		if (!styleInfo) {
			return;
		}
		this.clearWorkspace();

		let templateUsings = _(this.workspaceModel.instruments)
			.map(x => x.metaData.usings)
			.flatten()
			.map(x => `using "${x}";`)
			.value();
		const instruments = await this.createInstruments();
		const usings = templateUsings.concat(this.workspaceModel.files.map(x => `using "./${x.path}";`));
		const templates = this.workspaceModel.instruments.map(x => x.metaData).map(x => `${x.instrument}.${x.title}.normal`)
		const chords = '\t' + (this.chords.element.nativeElement.value as string)
			.replace(/\n/g, '\n\t');
		const sheetText = mainSheetText
			.replace(/\$TEMPLATES/g, `/template: ${templates.join('\n\t')}\n\t/`)
			.replace(/\$USINGS/g, usings.join('\n'))
			.replace(/\$TEMPO/g, (styleInfo.metaData.tempo || 120).toString())
			.replace(/\$CHORDS/g, chords)
			.replace(/\$INSTRUMENTS/g, instruments.join("\n"));
		return sheetText;
	}

	public async createProject(): Promise<void> {
		const sheetText = await this.createMainSheet();
		this.workspaceModel.files.push({path: "main.sheet", data: sheetText});
		const request = {
			wid: null,
			files: this.workspaceModel.files
		};
		const response = await this.workspaceService.updateWorkspace(request);
		this.router.navigate(['/editor'], {queryParams: {wid: response.wid}});
	}

	public findInstruments(instrument: string): StyleFileInfo[] {
		return this.allStyleFileInfos
			.filter(x => x.id.startsWith(`${instrument}.`));
	}


	public parseTemplateName(fileName: string) : {instrument: string, name: string} {
		const fileNameMatch = fileName.match(/(?<instrument>\w+)\.(?<name>\w+).\w+/)
        if (!fileNameMatch.groups || !fileNameMatch.groups.instrument || !fileNameMatch.groups.name) {
            throw new Error("invalid file name: " + fileName);
        }
		return fileNameMatch.groups as {instrument: string, name: string};
	}

	public getInstrumentName(fileInfo: IStyleFileInfo): string {
		return fileInfo.metaData.instrument;
	}

	public get allInstruments(): string[] {
		return _(this.allStyleFileInfos)
			.map(x => this.getInstrumentName(x))
			.uniq()
			.sort()
			.value();
			
	}

	public async play(): Promise<void> {
		const text = await this.createMainSheet();
		await this.workspaceComponent.addFile("main.sheet", text);
		this.workspaceComponent.play();
	}

	public async stop(): Promise<void> {
		await this.workspaceComponent.stop();
	}

	public async changeTemplate(newInstrument: StyleFileInfo, instrumentIndex: number): Promise<void> {
		this.workspaceModel.instruments[instrumentIndex] = newInstrument;
	}

	public resetInstrumentSelection(instrumentIndex: number, newInstrumentName: string): void {
		const newInstrument =  _.first(this.findInstruments(newInstrumentName));
		this.changeTemplate(newInstrument, instrumentIndex);
	}

	public async addNewInstrument():Promise<void> {
		const newInstrument = _.cloneDeep(_.first(this.workspaceModel.instruments));
		this.workspaceModel.instruments.push(newInstrument);
	}

	public removeInstrument(instrumentIndex: number): void {
		if (!this.canRemove) {
			return;
		}
		this.workspaceModel.instruments.splice(instrumentIndex, 1);
	}

	public get canRemove(): boolean {
		return this.workspaceModel.instruments.length > 1;
	}
}
