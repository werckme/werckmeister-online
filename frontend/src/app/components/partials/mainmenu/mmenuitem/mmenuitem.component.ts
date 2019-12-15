import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'mmenuitem',
	templateUrl: './mmenuitem.component.html',
	styleUrls: ['./mmenuitem.component.scss']
})
export class MmenuitemComponent implements OnInit {

	@Input()
	mtitle: string;
	currentOutsideListener: any;
	private isOpen_: boolean;

	constructor() { }

	get isOpen(): boolean {
		return this.isOpen_;
	}

	@Input()
	set isOpen(val: boolean) {
		if(val) {
			this.onShowMenu();
		} else {
			this.onHideMenu();
		}
		this.isOpen_ = val;
		this.isOpenChange.emit(val);
	}

	@Output()
	isOpenChange = new EventEmitter<boolean>();

	ngOnInit() {
	}

	onClick(ev: MouseEvent) {
		ev.preventDefault();
		this.isOpen = !this.isOpen;
	}

	onClickOutside(ev: MouseEvent) {
		this.isOpen = false;
	}

	onShowMenu() {
		if (!!this.currentOutsideListener) {
			return;
		}
		this.currentOutsideListener = this.onClickOutside.bind(this);
		setTimeout( ()=> {
			window.addEventListener("click", this.currentOutsideListener, false);
		}, 100);
	}

	onHideMenu() {
		if (!this.currentOutsideListener) {
			return;
		}
		window.removeEventListener("click", this.currentOutsideListener, false);
		this.currentOutsideListener = null;
	}
}
