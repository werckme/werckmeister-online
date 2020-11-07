import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { IFile, IWorkspace, WorkspaceStorageService } from 'src/app/online-editor/services/workspaceStorage';

interface IEditorElement {
  setScriptText(text: string);  
  getScriptText(): string;
  update();  
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
  workspace: IWorkspace;
  currentFile: IFile;

  get files(): IFile[] {
    if (!this.workspace) {
      return [];
    }
    return this.workspace.files;
  }

  constructor(private workspaceStorage: WorkspaceStorageService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router) {
  }


  ngAfterViewInit(): void {
    this.route.params.subscribe(async params => {
      await this.loadWorkspace(params.wid || null);
    });
  }

  private async loadWorkspace(id: string|null = null) {
    if (!!this.workspace) {
      return;
    }
    try {
      if (id === null) {
        this.workspace = await this.workspaceStorage.newWorkspace();
        history.replaceState({}, null, `/editor/${this.workspace.wid}`);
      } else {
        this.workspace = await this.workspaceStorage.loadWorkspace(id);
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
    this.currentFile = this.workspace.files[0];
    setTimeout(this.updateEditors.bind(this), 500);
  }


  syncEditorsWithWorkspace(workspace: IWorkspace) {
    for(const file of workspace.files) {
      const editor = this.getEditor(file.path);
      console.log(editor);
      file.data = editor.getScriptText();
    }
  }

  async save() {
    this.syncEditorsWithWorkspace(this.workspace);
    this.workspaceStorage.updateWorkspace(this.workspace);
  }

  ngOnInit() {
  }

  private registerEditor(editorEl: Element) {
    const workspaceNEl = this.workspaceEl.element.nativeElement as any;
    workspaceNEl.registerEditor(editorEl);
    const filename = editorEl.getAttribute('wm-filename');
    this.fileNameEditorMap.set(filename, (editorEl as any));
    const file = this.workspace.files.find(file => file.path === filename);
    (editorEl as any).setScriptText(file.data);
  }

  private updateEditors() {
    const editorsContainer:HTMLElement = this.editorMain.element.nativeElement;
    const editors = editorsContainer.getElementsByTagName('werckmeister-editor');
    for(const editor of Array.from(editors)) {
      this.registerEditor(editor);
    }
  }

  onFileClicked(file: IFile) {
    this.currentFile = file;
    const editor = this.fileNameEditorMap.get(file.path);
    setTimeout(editor.update.bind(editor));
  }

  getEditor(filename: string): IEditorElement {
    return this.fileNameEditorMap.get(filename);
  }

}
