import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineEditorComponent } from './components/online-editor/online-editor.component';
import { WorkspaceStorageService } from './services/workspaceStorage';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FileEntryComponent } from './components/online-editor/file-entry/file-entry.component';
import { FormsModule } from '@angular/forms';
import { ShortcutService } from './services/shortcut.service';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [OnlineEditorComponent, FileEntryComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WorkspaceStorageService, ShortcutService]
})
export class OnlineEditorModule { }
