import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';
import { IpanemaComponent } from './components/pages/examples/ipanema.component';
import { GettingStartedComponent } from './components/pages/getting-started';
import { ExamplesComponent } from './components/pages/examples/examples.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CodeExtensionComponent } from './components/pages/visual-studio-extension';
import { DownloadComponent } from './components/pages/download/download.component';
import { OnlineEditorComponent } from './online-editor/components/online-editor/online-editor.component';


const routes: Routes = [
	{ path: '', redirectTo: 'werckmeister', pathMatch: 'full'},
	{ path: 'werckmeister', component: WerckmeisterComponent},
	{ path: 'getting-started', component: GettingStartedComponent},
	{ path: 'code-extension', component: CodeExtensionComponent},
	{ path: 'manual', component: ManualComponent},
	{ path: 'examples', component: ExamplesComponent},
	{ path: 'contact', component: ContactComponent},
	{ path: 'getwerckmeister', component: DownloadComponent},
	{ path: 'editor', component: OnlineEditorComponent},
	{ path: 'editor/autumnleaves', component: OnlineEditorComponent, data: {preset: 'autumnleaves'}},
	{ path: 'editor/:wid', component: OnlineEditorComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
