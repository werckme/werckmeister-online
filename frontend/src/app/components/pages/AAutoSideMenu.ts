import { AfterViewInit, ElementRef } from '@angular/core';
import $ from 'jquery';
import { AppService, SideMenuItem } from 'src/app/services/app.service';
import * as _ from 'lodash';
export abstract class AAutoSideMenu implements AfterViewInit {
	constructor(protected elRef:ElementRef, protected app: AppService) { 
	}

	ngAfterViewInit() {
        setTimeout(()=>{
            this.udpateMenu();
        });
    }
    
    udpateMenu() {
        const content = $(this.elRef.nativeElement)
        const h2s = content.find("h2");
        const createMenuItem = function(el) {
            const item = new SideMenuItem(el.innerText);
            item.onClick = (ev: MouseEvent) => {
                console.log(content[0] );
                el.scrollIntoView({block: "center", behavior: "smooth"});
                
            };
            return item;
        }
        const sideMenuItems = _(h2s).map(el => createMenuItem(el)).value();
        this.app.sideMenuItems = sideMenuItems;
    }
}