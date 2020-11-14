import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { IFile, IWorkspace, WorkspaceStorageService } from 'src/app/online-editor/services/workspaceStorage';

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

  public newFile: IFile;

  constructor(private workspaceStorage: WorkspaceStorageService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router) {
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
      await this.loadWorkspace(params.wid || null);
    });
    this.workspaceComponent.onError = this.onCompilerError.bind(this);
    this.workspaceComponent.onCompiled = this.onWerckCompiled.bind(this);
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
        history.replaceState({}, null, `/editor/${this.workspaceModel.wid}`);
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
      return;
    }
    this.currentFile = this.workspaceModel.files[0];
    setTimeout(this.updateEditorWorkspaceRegister.bind(this), 500);
  }


  syncEditorsWithWorkspace(workspace: IWorkspace) {
    for(const file of workspace.files) {
      const editor = this.getEditorElement(file.path);
      file.data = editor.getScriptText();
    }
  }

  async save() {
    this.syncEditorsWithWorkspace(this.workspaceModel);
    this.workspaceStorage.updateWorkspace(this.workspaceModel);
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
    console.log("register " + filename)
    this.fileNameEditorMap.set(filename, (editorEl as any));
    const file = this.workspaceModel.files.find(file => file.path === filename);
    editorEl.setScriptText(file.data);
    editorEl.markClean();
  }

  private updateEditorWorkspaceRegister() {
    const editorsContainer:HTMLElement = this.editorMain.element.nativeElement;
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


  private createNewFile(filename: string) {
    const newFile = {
      data: "-- new file",
      path: filename
    };
    this.workspaceModel.files.push(newFile);
    setTimeout(() => {
      this.updateEditorWorkspaceRegister();
      const editor = this.fileNameEditorMap.get(filename);
      editor.setFilename(filename);
      this.workspaceFSModified = true;
      this.newFile = newFile;
    }, 100);
  }

  public onAddNewAccompaniment() {
    this.createNewFile('myTemplate.template');
  }

  public onAddNewPitchMap() {
    this.createNewFile('myPitchmap.pitchmap');
  }

  public onAddNewChordDef() {
    this.createNewFile('myChordDef.chordDef');
  }

  public onAddNewVoicingScript()  {
    this.createNewFile('myVoicingScript.lua');
  }

  public onAddNewModScript()  {
    this.createNewFile('myModScript.lua');
  }

  public pathExists(path: string) {
    return this.fileNameEditorMap.has(path);
  }

  public isValidPath(path: string, newPath: string) {
    const pathExists = (path === newPath) ? false : this.pathExists(newPath);
    return !pathExists;
  }
}
