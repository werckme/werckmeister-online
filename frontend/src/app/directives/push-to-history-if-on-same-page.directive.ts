import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPushToHistoryIfOnSamePage]',
})
export class PushToHistoryIfOnSamePageDirective {

  constructor(protected el: ElementRef<HTMLAnchorElement>) { }

  @HostListener('mousedown') 
  onClicked(ev: MouseEvent) {
    const id = this.el.nativeElement.id;
    history.replaceState({}, null, `manual#${id}`);
  }

}
