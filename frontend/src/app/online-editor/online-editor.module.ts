import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineEditorComponent } from './components/online-editor/online-editor.component';
import { WorkspaceStorageService } from './services/workspaceStorage';
import { FileEntryComponent } from './components/online-editor/file-entry/file-entry.component';
import { FormsModule } from '@angular/forms';
import { ShortcutService } from './services/shortcut.service';
import { AppRoutingModule } from '../app-routing.module';
import { FormatDirective } from './directives/format.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@NgModule({
  declarations: [OnlineEditorComponent, FileEntryComponent, FormatDirective],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    NzButtonModule,
		NzGridModule,
		NzLayoutModule,
		NzMenuModule,
		NzListModule,
		NzPageHeaderModule,
		NzTagModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WorkspaceStorageService, ShortcutService, NzNotificationService]
})
export class OnlineEditorModule { }
