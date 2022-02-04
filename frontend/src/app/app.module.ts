import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ManualComponent } from './components/pages/manual.component';
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
import { OnlineEditorModule } from './online-editor/online-editor.module';
import { EmbeddedSoundcloudPlayerComponent } from './components/partials/embedded-soundcloud-player/embedded-soundcloud-player.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HeroSnippetComponent } from './components/pages/home/hero-snippet/hero-snippet.component';
import { TuxComponent } from './components/partials/icons/tux/tux.component';
import { SongsService } from './services/songs.service';
import { EmbeddedHeaderComponent, EmbeddedLinkDirective } from './directives/embedded-link.directive';
import { EmbeddedYoutubeComponent } from './components/partials/embedded-youtube/embedded-youtube.component';
import { CreatorComponent } from './components/pages/creator/creator.component';
import { SongCardComponent } from './components/partials/song-card/song-card.component';
import { SongPreviewComponent } from './components/partials/song-preview/song-preview.component';
import { EmbeddedSoundcloudLinkComponent } from './components/partials/embedded-soundcloud-link/embedded-soundcloud-link.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { IconDefinition } from '@ant-design/icons-angular';
import { PlayCircleOutline, WindowsOutline, AppleOutline } from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { SortedPipe } from './pipes/sorted.pipe';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

const icons: IconDefinition[] = [ PlayCircleOutline, 
	WindowsOutline, 
	AppleOutline
];
registerLocaleData(en);
@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        WerckmeisterComponent,
        ManualComponent,
        GettingStartedComponent,
        ExamplesComponent,
        ContactComponent,
        CodeExtensionComponent,
        MobileAppMenuComponent,
        PushToHistoryIfOnSamePageDirective,
        DownloadComponent,
        ReleaseComponent,
        DownloadDetailsComponent,
        EmbeddedSoundcloudPlayerComponent,
        HomeComponent,
        HeroSnippetComponent,
        TuxComponent,
        EmbeddedLinkDirective,
        EmbeddedHeaderComponent,
        EmbeddedYoutubeComponent,
        CreatorComponent,
        SongCardComponent,
        SongPreviewComponent,
        EmbeddedSoundcloudLinkComponent,
        SortedPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        NzButtonModule,
        NzGridModule,
        NzLayoutModule,
        NzMenuModule,
        NzListModule,
        NzCardModule,
        NzPageHeaderModule,
        NzTagModule,
        NzIconModule,
        NzSelectModule,
        BrowserAnimationsModule,
        NgxPageScrollCoreModule,
        NgxPageScrollModule,
        NgZorroAntdMobileModule,
        NzDescriptionsModule,
        OnlineEditorModule,
        NzIconModule.forRoot(icons),
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
        SongsService,
        DecimalPipe
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
