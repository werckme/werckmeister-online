import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
	selector: 'accordion',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

	@Input()
	open: boolean;
    
	@Output()
	openChange = new EventEmitter<boolean>();
    
	@Input()
    handleVisible: boolean = true;
	
	height: number;

	@ViewChild('content', { static: true }) contentEl:ElementRef;

	constructor(private sanitizer: DomSanitizer) { 
	}

	get contentStyle(): SafeStyle {
		let style = `height: ${this.height}px;`;
		return this.sanitizer.bypassSecurityTrustStyle(style);
	}

	ngOnInit() {
		setTimeout(()=>{
			this.height = (this.contentEl.nativeElement as HTMLElement).scrollHeight + 50;
		}, 100);

    }
    
	onClicked(event: MouseEvent) {
		if (!this.handleVisible) {
			return;
		}
		this.open = !this.open;
		this.openChange.emit(this.open);
	}

}
