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
import { IconDefinition } from '@ant-design/icons-angular';
import { PlusOutline, DownloadOutline, SaveOutline, CaretRightOutline, EditOutline, DeleteOutline, CheckOutline, CloseOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { WizzardComponent } from './components/wizzard/wizzard.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

const icons: IconDefinition[] = [ PlusOutline, 
  DownloadOutline, 
  SaveOutline, 
  CaretRightOutline, 
  EditOutline, 
  DeleteOutline, 
  CheckOutline,
  CloseOutline
];

@NgModule({
  declarations: [OnlineEditorComponent, 
    FileEntryComponent, 
    FormatDirective, 
    WizzardComponent],
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
    NzProgressModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzAlertModule,
    NzInputNumberModule,
    NzInputModule,
    NzSpinModule,
    NzIconModule.forRoot(icons),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WorkspaceStorageService, ShortcutService, NzNotificationService]
})
export class OnlineEditorModule { }
