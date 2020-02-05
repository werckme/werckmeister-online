import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
	selector: '[appWerckmeisterCode]'
})
export class WmcodeDirective implements OnInit {

	source: string;
	constructor(protected el: ElementRef<HTMLLinkElement>) {
	}

	ngOnInit() {
		this.source = this.el.nativeElement.innerText;
		console.log(this.source);
	}

}
