import { Injectable } from '@angular/core';


declare const MIDI: any;

/**
 * there seems to be a problem with MIDI.js, where if a note event appears
 * right after a control event without any delta, then the first note
 * will be dissapear.
 * So we fix that by adding a small delta to the first event.
 */
function fixBrokenDeltaPlayback() {
	const deltaFix = 1;
	const data = MIDI.Player.data;
	for (const event of data) {
		const evData = event[0];
		const needsAFix = evData.event.subtype === 'noteOn';
		if (needsAFix) {
			event[1] = deltaFix;
			evData.event.deltaTime = deltaFix;
			evData.ticksToEvent = deltaFix;
			break;
		}
	}
	MIDI.Player.replayer.getData = () => data;
}


@Injectable({
	providedIn: 'root'
})
export class MidiplayerService {
	private _player: any;
	private _tempo = 120;
	constructor() { 
	}

	get tempo(): number {
		return this._tempo;
	}

	set tempo(val: number) {
		this._tempo = val;
	}

	getPlayer(event: MouseEvent | KeyboardEvent): Promise<any> {
		if (this._player) {
			return this._player;
		}
		return new Promise((resolve, reject) => {
			MIDI.loadPlugin({
				soundfontUrl: './assets/soundfont/',
				instrument: 'acoustic_grand_piano',		
				onerror: reject,
				onsuccess: () => {
					this._player = MIDI.Player;
					resolve(this._player);
				}
			});
		});
	}

	private loadFile(midiBase64: string, player): Promise<void> {
		return new Promise((resolve, reject) => {
			player.loadFile('base64,' + midiBase64, resolve);
		});
	}

	async play(midiBase64: string, event: MouseEvent | KeyboardEvent) {
		const player = await this.getPlayer(event);
		player.BPM = this._tempo;
		await this.loadFile(midiBase64, player);
		fixBrokenDeltaPlayback();	
		player.stop(); // stops all audio being played, and resets currentTime to 0.
		player.start();
		
	}

}
