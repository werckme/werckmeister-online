import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineEditorComponent } from './components/online-editor/online-editor.component';
import { WorkspaceStorageService } from './services/workspaceStorage';



@NgModule({
  declarations: [OnlineEditorComponent],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WorkspaceStorageService]
})
export class OnlineEditorModule { }
