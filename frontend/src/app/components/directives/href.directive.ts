import { Directive, ElementRef } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Directive({
	selector: '[href]',
	host: {
		'(click)': 'onClick($event)',
		
	}
})
export class HrefDirective {

	constructor(protected el:ElementRef<HTMLLinkElement>, protected app: AppService) { }

	onClick(ev: MouseEvent) {
		let attr = this.el.nativeElement.attributes.getNamedItem("href");
		if (!attr) {
			return;
		}
		let value = attr.value;
		if (!value || value === '#') {
			return;
		}
		ev.preventDefault();
		this.app.openLink(value);
	}
}
