import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { Router, NavigationEnd, NavigationError, NavigationStart, Event } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	mobileMenuOpen: boolean = false;
	constructor(public app: AppService, private router: Router) {
		this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
            }

            if (event instanceof NavigationEnd) {
				window.scrollTo(0, 0);
            }

            if (event instanceof NavigationError) {
            }
        });
	}

	onMobileMenuItemClicked(event: MouseEvent) {
		this.mobileMenuOpen = false;
	}
}
