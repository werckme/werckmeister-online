import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { Router, NavigationEnd, NavigationError, NavigationStart, Event } from '@angular/router';
import { WerckService } from './services/werck.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(public app: AppService, private router: Router, private werck: WerckService) {
		this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
				if (this.werck.isPlaying) {
					this.werck.stop();
				}
            }

            if (event instanceof NavigationEnd) {
            }

            if (event instanceof NavigationError) {
            }
        });
	}
}
