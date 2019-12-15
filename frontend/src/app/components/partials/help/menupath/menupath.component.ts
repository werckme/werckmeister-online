import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'help-menupath',
	templateUrl: './menupath.component.html',
	styleUrls: ['./menupath.component.scss']
})
export class MenupathComponent implements OnInit {

	@Input()
	path: string[];

	constructor() { }

	ngOnInit() {
	}

}
