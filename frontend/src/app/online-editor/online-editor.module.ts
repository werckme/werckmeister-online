import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineEditorComponent } from './componente/online-editor/online-editor.component';



@NgModule({
  declarations: [OnlineEditorComponent],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OnlineEditorModule { }
