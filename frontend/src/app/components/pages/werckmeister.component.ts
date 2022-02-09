import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
	selector: 'app-werckmeister',
	templateUrl: './werckmeister.html',
	styleUrls: ['werckmeister.scss', 'manual.scss']
})
export class WerckmeisterComponent implements OnInit {
	constructor(elRef:ElementRef, app: AppService) { 
	}

	async ngOnInit() {
	}
}
