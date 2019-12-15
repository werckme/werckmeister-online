import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'main-editor',
	templateUrl: './main-editor.component.html',
	styleUrls: ['./main-editor.component.scss']
})
export class MainEditorComponent implements OnInit {

	constructor(public app: AppService) { }

	ngOnInit() {
	}

}
