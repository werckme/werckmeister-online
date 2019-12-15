import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { BackendService } from 'src/app/services/backend.service';

@Component({
	selector: 'app-intro',
	templateUrl: './intro.component.html',
	styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {

	constructor(public app: AppService) { }

	ngOnInit() {
	}
	
}
