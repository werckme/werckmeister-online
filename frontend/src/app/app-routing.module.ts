import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';
import { IpanemaComponent } from './components/pages/examples/ipanema.component';
import { GettingStartedComponent } from './components/pages/getting-started';


const routes: Routes = [
	{ path: '', component: WerckmeisterComponent},
	{ path: 'werckmeister', component: WerckmeisterComponent},
	{ path: 'getting-started', component: GettingStartedComponent},
	{ path: 'manual', component: ManualComponent},
	{ path: 'examples/autumnleaves', component: AutumnLeavesComponent},
	{ path: 'examples/ipanema', component: IpanemaComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {anchorScrolling: 'enabled'})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
