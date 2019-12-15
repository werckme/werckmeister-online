import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import * as _ from 'lodash';
export interface MainMenuEvent extends MouseEvent {
	consumed: boolean;
}

@Component({
	selector: 'mainmenu',
	templateUrl: './mainmenu.component.html',
	styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {

	ctrl = "Ctrl"
	isOpen: boolean[] = [];
	constructor(public app: AppService) { }

	ngOnInit() {
	}

	handle(ev: MouseEvent, handler: ()=>any) {
		(ev as MainMenuEvent).consumed = true;
		setTimeout(()=>{
			handler.bind(this.app)();
		});
	}

	get isAMenuOpen(): boolean {
		return _(this.isOpen).some(x=>!!x);
	}

	onMouseEnter(ev: MouseEvent, idx: number) {
		if (!this.isAMenuOpen) {
			return;
		}
		for(let i=0; i<this.isOpen.length; ++i) {
			this.isOpen[i] = false;
		}
		this.isOpen[idx] = true;
	}

}
