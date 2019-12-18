import { Injectable } from '@angular/core';
import * as MIDI from 'midicube';

@Injectable({
	providedIn: 'root'
})
export class MidiplayerService {
	ready: Promise<void>;
	player: any;
	constructor() { 
		this.init();
	}

	init() {
		this.ready = new Promise((resolve, reject) => {
			console.log(MIDI);
			MIDI.loadPlugin({
				// this only has piano. 
				// for other sounds install the MIDI.js 
				// soundfonts somewhere.
				instrument: "acoustic_grand_piano",
				soundfontUrl: "./assets/soundfont/",
				onerror: reject,
				onsuccess: resolve
			});
		}).then(()=>{
			this.player = new MIDI.Player();
			console.log(MIDI.supports);
		});
	}

	private loadFile(midiBase64: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.player.loadFile("base64,"+midiBase64, resolve);
		});
	}

	async play(midiBase64: string) {
		await this.ready;
		await this.loadFile(midiBase64);
		this.player.addListener(function(data) {
			console.log(data);
		});
		this.player.start();
		
		console.log("FILE LOADED");
	}

}
