import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { GettingStartedComponent } from './components/pages/getting-started';
import { ResourcesComponent } from './components/pages/resources/resources.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CodeExtensionComponent } from './components/pages/visual-studio-extension';
import { DownloadComponent } from './components/pages/download/download.component';
import { OnlineEditorComponent } from './online-editor/components/online-editor/online-editor.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CreatorComponent } from './components/pages/creator/creator.component';
import { ManualPageComponent } from './components/pages/manual-page/manual-page.component';
import { ExtrasComponent } from './components/pages/extras/extras.component';
import { WizzardComponent } from './online-editor/components/wizzard/wizzard.component';
import { VstComponent } from './components/pages/vst/vst.component';


const routes: Routes = [
	{ path: '', redirectTo: 'werckmeister', pathMatch: 'full'},
	{ path: 'werckmeister', component: HomeComponent},
	{ path: 'getting-started', component: GettingStartedComponent},
	{ path: 'code-extension', component: CodeExtensionComponent},
	{ path: 'manual', component: ManualPageComponent},
	{ path: 'resources', component: ResourcesComponent},
	{ path: 'examples', component: ResourcesComponent},
	{ path: 'contact', component: ContactComponent},
	{ path: 'getwerckmeister', component: DownloadComponent},
	{ path: 'editor', component: OnlineEditorComponent, data: {hasOwnLayout: true}},
	{ path: 'creator', component: CreatorComponent},
	{ path: 'extras', component: ExtrasComponent},
	{ path: 'wizzard', component: WizzardComponent},
	{ path: 'vst', component: VstComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
