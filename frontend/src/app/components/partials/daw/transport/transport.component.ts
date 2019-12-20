import { Component, OnInit } from '@angular/core';
import { WerckService } from 'src/app/services/werck.service';
import { Router } from '@angular/router';

@Component({
	selector: 'transport',
	templateUrl: './transport.component.html',
	styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

	constructor(public werck: WerckService, protected route: Router) { 

	}

	ngOnInit() {
	}

	play() {
		this.werck.play(null);
	}

	pause() {
		this.werck.pause();
	}

	stop() {
		this.werck.stop();
	}

	get transportEnabled(): boolean {
		let idx = this.route.url.indexOf('tutorial');
		return idx < 0;
	}
}
