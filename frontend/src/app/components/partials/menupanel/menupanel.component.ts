import { Component, OnInit } from '@angular/core';
import { MainMenuEvent } from '../mainmenu/mainmenu.component';

@Component({
	selector: 'menupanel',
	templateUrl: './menupanel.component.html',
	styleUrls: ['./menupanel.component.scss']
})
export class MenupanelComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	onClick(ev: MainMenuEvent) {
		if (!ev.consumed) {
			ev.stopPropagation();
		}
	}

}
