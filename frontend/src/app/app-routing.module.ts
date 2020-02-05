import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WerckmeisterComponent } from './components/pages/werckmeister.component';
import { ManualComponent } from './components/pages/manual.component';
import { AutumnLeavesComponent } from './components/pages/examples/autumn.component';


const routes: Routes = [
	{ path: '', component: ManualComponent},
	{ path: 'autumnleaves', component: AutumnLeavesComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
