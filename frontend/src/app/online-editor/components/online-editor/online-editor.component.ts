import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IFile, IWorkspace, WorkspaceStorageService } from 'src/app/online-editor/services/workspaceStorage';

interface IEditorElement {
  setScriptValue(text: string);  
  getScriptValue(): string;
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

  constructor(private workspaceStorage: WorkspaceStorageService) { }


  ngAfterViewInit(): void {
    this.loadWorkspace();
  }

  private async loadWorkspace() {
    this.workspace = await this.workspaceStorage.emptyWorkspace();
    this.currentFile = this.workspace.files[0];
    setTimeout(this.updateWorkspace.bind(this), 500);
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

  private updateWorkspace() {
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

}
