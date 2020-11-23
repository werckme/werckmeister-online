import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { IFile, IWorkspace, WorkspaceStorageService } from 'src/app/online-editor/services/workspaceStorage';
import { ShortcutService } from '../../services/shortcut.service';
import { TmplLuaVoicing, TmplPitchmap, TmplSheetTemplate, TmplLuaMod } from './fileTemplates';

const CheckIsCleanIntervalMillis = 1000;

interface IEditorElement extends HTMLElement {
  setScriptText(text: string);  
  getScriptText(): string;
  isClean(): boolean;
  markClean();
  update();
  setFilename(name: string);
}

interface IWorkspaceElement extends HTMLElement {
  registerEditor(editor: Element);
  unregisterEditor(editor: Element);
  isClean(): boolean;
  markClean();
  onError: (error) => void;
  onCompiled: (document) => void;
}

interface ICompilerError {
  sourceId: number; 
  positionBegin: number; 
  sourceFile: string; 
  errorMessage: string;
}

@Component({
  selector: 'ngwerckmeister-online-editor',
  templateUrl: './online-editor.component.html',
  styleUrls: ['./online-editor.component.scss']
})
export class OnlineEditorComponent implements OnInit, AfterViewInit {
  @ViewChild("editorMain", { read: ViewContainerRef, static: false }) editorMain: ViewContainerRef;
  @ViewChild("workspace", { read: ViewContainerRef, static: false }) workspaceEl: ViewContainerRef;

  private fileNameEditorMap = new Map<string, IEditorElement>();
  workspaceModel: IWorkspace;
  private _workspaceEditorsAreClean: boolean;
  workspaceFSModified: boolean = false;

  get workspaceIsClean(): boolean {
    return this._workspaceEditorsAreClean && this.workspaceFSModified === false;
  }

  get workspaceComponent(): IWorkspaceElement|null {
    if (!this.workspaceEl) {
      return null;
    }
    return this.workspaceEl.element.nativeElement as IWorkspaceElement;
  }

  currentFile: IFile;

  get files(): IFile[] {
    if (!this.workspaceModel) {
      return [];
    }
    return this.workspaceModel.files;
  }

  public newFile: IFile|null;

  constructor(private workspaceStorage: WorkspaceStorageService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private shortcutSerice: ShortcutService) {
      setInterval(this.onCheckIsClean.bind(this), CheckIsCleanIntervalMillis);
  }

  onCheckIsClean() {
    if (!this.workspaceComponent) {
      return;
    }
    this._workspaceEditorsAreClean = this.workspaceComponent.isClean();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(async params => {
      const wid = this.route.snapshot.queryParams.wid;
      await this.loadWorkspace(wid || null);
    });
    this.workspaceComponent.onError = this.onCompilerError.bind(this);
    this.workspaceComponent.onCompiled = this.onWerckCompiled.bind(this);
    this.shortcutSerice.when().ctrlAndChar('s').thenExecute(()=>{
      this.save();
    });
  }

  private onCompilerError(error: ICompilerError) {
    this.notification.error(error.sourceFile || 'Compiler error', error.errorMessage);
  }

  private onWerckCompiled(document: any) {
    console.log(document);
  }

  private async loadWorkspace(id: string|null = null) {
    if (!!this.workspaceModel) {
      return;
    }
    try {
      if (id === null) {
        this.workspaceModel = await this.workspaceStorage.newWorkspace();
      } else {
        this.workspaceModel = await this.workspaceStorage.loadWorkspace(id);
      }
    } catch (ex) {
      console.log(ex);
      if (!id) {
        this.notification.error('Error', `Failed creating a workspace.`);
      } else {
        this.notification.error('Error', `Failed loading the workspace with id ${id}`);
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
    editorEl.markClean();
  }

  private updateEditorWorkspaceRegister() {
    const editorsContainer: HTMLElement = this.editorMain.element.nativeElement;
    const editors = editorsContainer.getElementsByTagName('werckmeister-editor');
    for(const editor of Array.from(editors)) {
      this.registerEditorElement(editor as IEditorElement);
    }
  }

  onFileClicked(file: IFile) {
    this.currentFile = file;
    const editor = this.fileNameEditorMap.get(file.path);
    setTimeout(editor.update.bind(editor));
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

  public onDelete(file: IFile) {
    const idx = this.workspaceModel.files.indexOf(file);
    if (idx < 0) {
        throw new Error(`file not found: ${file.path}`);
    }
    this.workspaceModel.files.splice(idx, 1);
    const editor = this.fileNameEditorMap.get(file.path);
    this.workspaceComponent.unregisterEditor(editor);
    this.fileNameEditorMap.delete(file.path);
    this.currentFile = this.workspaceModel.files[0];
    this.workspaceFSModified = true;
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

  public pathExists(path: string) {
    return this.fileNameEditorMap.has(path);
  }

  public isValidPath(path: string) {
    return this.pathExists(path) === false;
  }

}
