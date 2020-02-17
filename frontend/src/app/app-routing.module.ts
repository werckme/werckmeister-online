import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';
import { IpanemaComponent } from './components/pages/examples/ipanema.component';


const routes: Routes = [
	{ path: '', component: ManualComponent},
	{ path: 'manual', component: ManualComponent},
	{ path: 'examples/autumnleaves', component: AutumnLeavesComponent},
	{ path: 'examples/ipanema', component: IpanemaComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
