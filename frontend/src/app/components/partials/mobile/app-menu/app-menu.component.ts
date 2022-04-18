import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { setScrollLock } from '../../../../../shared/VanillaJs';

@Component({
  selector: 'lib-mobile-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class MobileAppMenuComponent implements OnInit {
  private _isOpen: boolean = false;

  @Input()
  set isOpen(val: boolean) {
    this._isOpen = val;
    setScrollLock(this.isOpen);
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output()
  isOpenChange = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

  onOpenChange() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

}
