import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShortcutService } from './services/shortcut.service';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';
import { IpanemaComponent } from './components/pages/examples/ipanema.component';
import { GettingStartedComponent } from './components/pages/getting-started';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ExamplesComponent } from './components/pages/examples/examples.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CodeExtensionComponent } from './components/pages/visual-studio-extension';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { MobileAppMenuComponent } from './components/partials/mobile/app-menu/app-menu.component';
import { PushToHistoryIfOnSamePageDirective } from './directives/push-to-history-if-on-same-page.directive';
import { DownloadComponent } from './components/pages/download/download.component';
import { ReleaseComponent } from './components/pages/download/release/release.component';
import { DownloadDetailsComponent } from './components/pages/download/release/download-details/download-details.component';

registerLocaleData(en);
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		WerckmeisterComponent,
		ManualComponent,
		AutumnLeavesComponent,
		IpanemaComponent,
		GettingStartedComponent,
		ExamplesComponent,
		ContactComponent,
		CodeExtensionComponent,
		MobileAppMenuComponent,
		PushToHistoryIfOnSamePageDirective,
		DownloadComponent,
		ReleaseComponent,
		DownloadDetailsComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		NgZorroAntdModule,
		BrowserAnimationsModule,
		NgxPageScrollCoreModule,
		NgxPageScrollModule,
		NgZorroAntdMobileModule
	],
	providers: [ShortcutService, { provide: NZ_I18N, useValue: en_US }],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
