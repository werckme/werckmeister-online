import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './components/partials/editor/editor.component';
import { BackendService } from './services/backend.service';
import { ShortcutService } from './services/shortcut.service';
import { TransportComponent } from './components/partials/daw/transport/transport.component';
import { FilelistComponent } from './components/partials/filelist/filelist.component';
import { ConsoleComponent } from './components/partials/console/console.component';
import { KlavierComponent } from './components/partials/daw/klavier/klavier.component';
import { InstrumentSelectComponent } from './components/partials/daw/instrument-select/instrument-select.component';
import { FolderComponent } from './components/partials/folder/folder.component';
import { TutorialsnippetComponent } from './components/partials/help/tutorialsnippet/tutorialsnippet.component';
import { ExpressionComponent } from './components/partials/help/expression/definition.component';
import { TipComponent } from './components/partials/help/tip/tip.component';
import { MenupathComponent } from './components/partials/help/menupath/menupath.component';
import { AccordionComponent } from './components/partials/accordion/accordion.component';
import { TocComponent } from './components/partials/help/toc/toc.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SnippedComponent } from './components/partials/help/snipped/snipped.component';
import { WmcodeDirective } from './directives/wmcode.directive';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';
import { IpanemaComponent } from './components/pages/examples/ipanema.component';
import { GettingStartedComponent } from './components/pages/getting-started';

registerLocaleData(en);
@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		TransportComponent,
		FilelistComponent,
		ConsoleComponent,
		KlavierComponent,
		InstrumentSelectComponent,
		FolderComponent,
		TutorialsnippetComponent,
		ExpressionComponent,
		TipComponent,
		MenupathComponent,
		ExpressionComponent,
		MenupathComponent,
		TipComponent,
		AccordionComponent,
		TocComponent,
		HeaderComponent,
		SnippedComponent,
		WmcodeDirective,
		WerckmeisterComponent,
		ManualComponent,
		AutumnLeavesComponent,
		IpanemaComponent,
		GettingStartedComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		NgbModule,
		HttpClientModule,
		NgZorroAntdModule,
		BrowserAnimationsModule
	],
	providers: [BackendService, ShortcutService, { provide: NZ_I18N, useValue: en_US }],
	bootstrap: [AppComponent]
})
export class AppModule { }
