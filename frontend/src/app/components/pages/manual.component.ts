import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AnchorScrollSpy } from 'src/shared/VanillaJs';
import { IListOfContentsEntry, ListOfContentsComponent } from '../partials/list-of-contents/list-of-contents.component';

@Component({
	selector: 'app-manual',
	templateUrl: './manual.html',
	styleUrls: ['manual.scss']
})
export class ManualComponent implements OnInit {
	constructor() {
	}

	ngOnInit() {
	}


}
