import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { GettingStartedComponent } from './components/pages/getting-started';
import { ExamplesComponent } from './components/pages/examples/examples.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CodeExtensionComponent } from './components/pages/visual-studio-extension';
import { DownloadComponent } from './components/pages/download/download.component';
import { OnlineEditorComponent } from './online-editor/components/online-editor/online-editor.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CreatorComponent } from './components/pages/creator/creator.component';


const routes: Routes = [
	{ path: '', redirectTo: 'werckmeister', pathMatch: 'full'},
	{ path: 'werckmeister', component: HomeComponent},
	{ path: 'getting-started', component: GettingStartedComponent},
	{ path: 'code-extension', component: CodeExtensionComponent},
	{ path: 'manual', component: ManualComponent},
	{ path: 'examples', component: ExamplesComponent},
	{ path: 'contact', component: ContactComponent},
	{ path: 'getwerckmeister', component: DownloadComponent},
	{ path: 'editor', component: OnlineEditorComponent, data: {hasOwnLayout: true}},
	{ path: 'creator', component: CreatorComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
