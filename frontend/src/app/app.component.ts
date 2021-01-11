import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { Router, NavigationEnd, NavigationError, NavigationStart, Event, ActivatedRoute, ActivationEnd, ActivationStart } from '@angular/router';
import * as _ from 'lodash';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	mobileMenuOpen: boolean = false;
	hasOwnLayout: boolean = false;
	constructor(public app: AppService, private router: Router, private route: ActivatedRoute) {
		this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
				window.scrollTo(0, 0);
            }
			
			if (event instanceof ActivationStart) {
				let ev = event as any;
				if (ev.snapshot) {
					this.hasOwnLayout = !!ev.snapshot.data.hasOwnLayout;
					console.log(this.hasOwnLayout)
				}
			}
        });
	}
	
	ngOnInit(): void {
	}

	onMobileMenuItemClicked(event: MouseEvent) {
		this.mobileMenuOpen = false;
	}

	get urlSegments(): string[] {
		return this.router.url.split('/');
	}

	getHasOwnLayout(): boolean {
		const lastUrlSegment = _.last(this.urlSegments);
		if (lastUrlSegment && lastUrlSegment.indexOf('editor') >= 0) {
			return true;
		}
		return false;
	}
}
