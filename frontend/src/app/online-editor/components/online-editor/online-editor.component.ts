import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { IFile, IWorkspace, WorkspaceStorageService } from 'src/app/online-editor/services/workspaceStorage';
import { ShortcutService } from '../../services/shortcut.service';
import { TmplLuaVoicing, TmplPitchmap, TmplSheetTemplate, TmplLuaMod, TmplConductionRules } from './fileTemplates';
import * as _ from 'lodash';
import { waitAsync } from 'src/shared/help/waitAsync';
import { AWorkspacePlayerComponent, ICompilerError, IEditorElement, IWorkspaceElement, PlayerState } from './AWorkspacePlayerComponent';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

const CheckIsCleanIntervalMillis = 1000;

@Component({
  selector: 'ngwerckmeister-online-editor',
  templateUrl: './online-editor.component.html',
  styleUrls: ['./online-editor.component.scss']
})
export class OnlineEditorComponent extends AWorkspacePlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("editorMain", { read: ViewContainerRef }) editorMain: ViewContainerRef;
  @ViewChild("workspace", { read: ViewContainerRef }) workspaceEl: ViewContainerRef;

  private fileNameEditorMap = new Map<string, IEditorElement>();
  workspaceModel: IWorkspace;
  private _workspaceEditorsAreClean: boolean;
  private clockUpdateMillis: number = 200;
  private clockStartTime: number = 0;
  public elapsedQuaters: number = 0;
  public bpm: number = 120;
  private beginQuarters: number = 0;
  private _beginQuartersStr : string = "0";
  public get beginQuartersStr() : string {
    return this._beginQuartersStr;
  }
  public set beginQuartersStr(v : string) {
    this._beginQuartersStr = v;
    this.beginQuarters = Number.parseFloat(v) || 0;
  }

  workspaceFSModified: boolean = false;

  get workspaceIsClean(): boolean {
    return this._workspaceEditorsAreClean && this.workspaceFSModified === false;
  }
  currentFile: IFile;

  get files(): IFile[] {
    if (!this.workspaceModel) {
      return [];
    }
    return this.workspaceModel.files;
  }

  public newFile: IFile|null;
  private routerSubscription: Subscription;
  private checkIsCleanId: any;
  private clockIntervalHandle:number|null = null;
  constructor(private workspaceStorage: WorkspaceStorageService,
    notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private shortcutSerice: ShortcutService) {
      super(notification);
      this.checkIsCleanId = setInterval(this.onCheckIsClean.bind(this), CheckIsCleanIntervalMillis);
      this.routerSubscription = this.router.events.subscribe((ev)=>{
        if (ev instanceof NavigationEnd) {
          const wid = this.route.snapshot.queryParams.wid;
          if (this.route.snapshot.queryParams.begin) {
            const numberVal = Number.parseFloat(this.route.snapshot.queryParams.begin);
            if (!Number.isNaN(numberVal) && !!numberVal) {
              this.beginQuartersStr = numberVal.toString();
            }
          }
          this.loadWorkspace(wid || null);
        }
      });
  }


  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.checkIsCleanId) {
      clearInterval(this.checkIsCleanId);
    }
    if (this.workspaceComponent) {
      this.workspaceComponent.stop();
    }
  }

  onCheckIsClean() {
    if (!this.workspaceComponent) {
      return;
    }
    this._workspaceEditorsAreClean = this.workspaceComponent.isClean();
  }

  ngAfterViewInit(): void {
    this.initWorkspace();
    this.shortcutSerice.when().ctrlAndChar('s').thenExecute(() => {
      this.save();
  });
  }

  protected onCompilerError(error: ICompilerError) {
    this.notification.error(error.sourceFile || 'Compiler error', error.errorMessage);
  }

  protected onWerckCompiled(document: any) {
    this.bpm = document.midi.bpm;
  }

  protected onPlayerStateChanged(old: PlayerState, new_: PlayerState) {
    super.onPlayerStateChanged(old, new_);
    if (old == new_) {
      return;
    }
    if (new_ === PlayerState.Preparing) {
      this.workspaceComponent.beginQuarters = this.beginQuarters;
      this.elapsedQuaters = this.beginQuarters;
    }
    if (new_ === PlayerState.Playing) {
      this.onPlayerStarted();
    }
    if (new_ === PlayerState.Stopped) {
      this.onPlayerStoped();
    }
  }

  private onPlayerStarted() {
    this.clockIntervalHandle = setInterval(this.updateClock.bind(this), this.clockUpdateMillis) as any;
    this.clockStartTime = performance.now();
  }

  private onPlayerStoped() {
    if (this.clockIntervalHandle !== null) {
      clearInterval(this.clockIntervalHandle);
      this.clockIntervalHandle = null;
    }
  }


  private updateClock() {
    const elapsedMillis = performance.now() - this.clockStartTime;
    this.elapsedQuaters = ((this.bpm / 60 / 1000) * elapsedMillis) + this.beginQuarters;
  }

  private sortWorkspaceFiles() {
    this.workspaceModel.files = this.workspaceModel.files.sort((a, b) => {
      if (a.path.startsWith('_')) {
        return 1;
      }
      if (b.path.startsWith('_')) {
        return -1;
      }
      if (a.path === 'main.sheet') {
        return -1;
      }
      if (b.path === 'main.sheet') {
        return 1;
      }
      return a.path.localeCompare(b.path);
    });
  }

  private async loadWorkspace(id: string|null = null) {
    if (!!this.workspaceModel) {
      this.clearWorksapce();
    }
    try {
      if (id === null) {
        this.workspaceModel = await this.workspaceStorage.newWorkspace();
      } else {
        this.workspaceModel = await this.workspaceStorage.loadWorkspace(id); 
        this.sortWorkspaceFiles();
      }
    } catch (ex) {
      if (!id) {
        this.notification.error('Error', `Failed creating a workspace.`);
      } else {
        if (ex.userFriendlyMessage) {
          this.notification.error('Error', ex.userFriendlyMessage, {nzDuration: null});
        } else {
          this.notification.error('Error', `Failed loading the workspace with id ${id}`, {nzDuration: null});
        }
      }
      this.router.navigate(['editor']);
      return;
    }
    this.currentFile = this.workspaceModel.files[0];
    setTimeout(this.updateEditorWorkspaceRegister.bind(this), 500);
  }


  syncEditorsWithWorkspace(workspace: IWorkspace) {
    for (const file of workspace.files) {
      const editor = this.getEditorElement(file.path);
      file.data = editor.getScriptText();
    }
  }

  updateWid(wid: string) {
    if (this.workspaceModel.wid === wid) {
      return;
    }
    this.workspaceModel.wid = wid;
    history.replaceState({}, null, `/editor?wid=${wid}`);
  }

  async save() {
    this.syncEditorsWithWorkspace(this.workspaceModel);
    try {
      const result = await this.workspaceStorage.updateWorkspace(this.workspaceModel);
      this.updateWid(result.wid);
    } catch(ex) {
      this.notification.error('Error', 'Saving workspace failed.');
    }
    this.workspaceComponent.markClean();
    this.workspaceFSModified = false;
  }

  ngOnInit() {
  }

  private registerEditorElement(editorEl: IEditorElement) {
    const workspaceNEl = this.workspaceEl.element.nativeElement as IWorkspaceElement;
    workspaceNEl.registerEditor(editorEl);
    const filename = editorEl.getAttribute('wm-filename');
    if (this.fileNameEditorMap.has(filename)) {
      return;
    }
    this.fileNameEditorMap.set(filename, (editorEl as any));
    const file = this.workspaceModel.files.find(file => file.path === filename);
    editorEl.setScriptText(file.data);
    editorEl.clearHistory();
    editorEl.markClean();
  }

  private updateEditorWorkspaceRegister() {
    const editorsContainer: HTMLElement = this.editorMain.element.nativeElement;
    const editors = editorsContainer.getElementsByTagName('werckmeister-editor');
    for(const editor of Array.from(editors)) {
      this.registerEditorElement(editor as IEditorElement);
    }
    this.reInitCurrentEditor();
  }

  private async reInitCurrentEditor(): Promise<void> {
    const editor = this.fileNameEditorMap.get(this.currentFile.path);
    await waitAsync(50);
    await editor.update();
  }

  onFileClicked(file: IFile) {
    this.currentFile = file;
    this.reInitCurrentEditor();
  }

  getEditorElement(filename: string): IEditorElement {
    return this.fileNameEditorMap.get(filename);
  }

  onFileNameChanged(file: IFile, newName: string) {
    const editor = this.fileNameEditorMap.get(file.path);
    this.fileNameEditorMap.delete(file.path);
    editor.setFilename(newName);
    file.path = newName;
    this.fileNameEditorMap.set(newName, editor);
    this.workspaceFSModified = true;
  }

  onNewFileCancel() {
    this.newFile = null;
  }

  onNewFileAdded(newFile: IFile, newName: string) {
    this.newFile = null;
    newFile.path = newName;
    this.workspaceModel.files.push(newFile);
    setTimeout(() => {
      this.updateEditorWorkspaceRegister();
      const editor = this.fileNameEditorMap.get(newName);
      editor.setFilename(newName);
      this.workspaceFSModified = true;
    }, 100);
  }

  private createNewFile(filename: string, data = '') {
    this.newFile = {
      data: data,
      path: filename
    };
  }

  private deleteFile(file: IFile) {
    const idx = this.workspaceModel.files.indexOf(file);
    if (idx < 0) {
        throw new Error(`file not found: ${file.path}`);
    }
    this.workspaceModel.files.splice(idx, 1);
    const editor = this.fileNameEditorMap.get(file.path);
    this.workspaceComponent.unregisterEditor(editor);
    this.fileNameEditorMap.delete(file.path);
    this.currentFile = this.workspaceModel.files[0];
  }

  public onDelete(file: IFile) {
    this.deleteFile(file);
    this.workspaceFSModified = true;
  }

  private clearWorksapce() {
    const filesToDelete = _.clone(this.workspaceModel.files);
    for(const file of filesToDelete) {
      this.deleteFile(file);
    }
    this.workspaceModel = null;
  }

  public onAddNewAccompaniment() {
    this.createNewFile('myTemplate.template', TmplSheetTemplate);
  }

  public onAddNewPitchMap() {
    this.createNewFile('myPitchmap.pitchmap', TmplPitchmap);
  }

  public onAddNewVoicingScript()  {
    this.createNewFile('myVoicing.lua', TmplLuaVoicing);
  }

  public onAddNewModScript()  {
    this.createNewFile('myMod.lua', TmplLuaMod);
  }

  public onAddNewConductionRules() {
    this.createNewFile('myRules.conductions', TmplConductionRules);
  }

  public pathExists(path: string) {
    return this.fileNameEditorMap.has(path);
  }

  public isValidPath(path: string) {
    return this.pathExists(path) === false;
  }

  public get widStr(): string {
    return this.workspaceModel.wid ? `-${this.workspaceModel.wid}` : '';
  }

  public download() {
    (this.workspaceComponent as any).download(`Werckmeister${this.widStr}.mid`);
  }

  public async downloadProject() {
    const zip = new JSZip();
    for(const file of this.workspaceModel.files) {
      zip.file(file.path, file.data);
    }
    const data = await zip.generateAsync({type: "blob"});
    FileSaver.saveAs(data, `Werckmeister${this.widStr}.zip`);
  }

  public onFocus(event: FocusEvent) {
    setTimeout(() => {
      (event.target as any).select();
    }, 100);
  }

  public onBlur(event: FocusEvent) {
  }

  isDimished(file: IFile) {
    return file.path.startsWith('_');
  }
  
}
