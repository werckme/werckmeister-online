import { Injectable } from '@angular/core';


declare const MIDI: any;

@Injectable({
	providedIn: 'root'
})
export class MidiplayerService {
	private _player: any;
	constructor() { 
	}

	getPlayer(event: MouseEvent | KeyboardEvent): Promise<any> {
		const playTestNote = function() {
			var delay = 0;
			var note = 50;
			var velocity = 127;
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay + 0.75);
		};
		if (this._player) {
			return this._player;
		}
		return new Promise((resolve, reject) => {
			MIDI.loadPlugin({
				soundfontUrl: "./assets/soundfont/",
				instrument: "acoustic_grand_piano",
				onprogress: function(state, progress) {
					console.log(state, progress);
				},				
				onerror: reject,
				onsuccess: () => {
					this._player = MIDI.Player;
					resolve(this._player);
					//playTestNote();
				}
			});
		});
	}

	private loadFile(midiBase64: string, player): Promise<void> {
		return new Promise((resolve, reject) => {
			player.loadFile("base64,"+midiBase64, resolve);
		});
	}

	async play(midiBase64: string, event: MouseEvent | KeyboardEvent) {
		const player = await this.getPlayer(event);
		await this.loadFile(midiBase64, player);
		console.log("LOADED");
		
		MIDI.Player.addListener(function(data) { // set it to your own function!
			console.log(data);
		});
		
		player.stop(); // stops all audio being played, and resets currentTime to 0.
		player.start();
		
	}

}
