import { Injectable, EventEmitter } from '@angular/core';
import { Quarters } from 'src/shared/werck/types';
import * as _ from 'lodash';
import { MidiEvent } from 'src/shared/midi/midiEvent';

declare const MIDI: any;
declare const MidiFile: any;
const DeltaBugFixOffset = 1;

/**
 * there seems to be a problem with MIDI.js, where if a note event appears
 * right after a control event without any delta, then the first note
 * will be dissapear.
 * So we fix that by adding a small delta to the first event.
 */
function fixBrokenDeltaPlayback() {
	const data = MIDI.Player.data;
	for (const event of data) {
		const evData = event[0];
		const needsAFix = evData.event.subtype === 'noteOn';
		if (needsAFix) {
			event[1] = DeltaBugFixOffset;
			evData.event.deltaTime = DeltaBugFixOffset;
			evData.ticksToEvent = DeltaBugFixOffset;
			break;
		}
	}
	MIDI.Player.replayer.getData = () => data;
}

export interface IMidiplayerEvent {
	position: Quarters;
	midiEvent: MidiEvent;
}

@Injectable({
	providedIn: 'root'
})
export class MidiplayerService {
	private _player: any;
	private _tempo = 120;
	private _currentMidifile: any;
	public onEOF = new EventEmitter<void>();
	public onMidiEvent = new EventEmitter<IMidiplayerEvent>();
	private onEofDebounced: any = null;
	constructor() { 
		this.onEofDebounced = _.debounce(this.onEOF.emit.bind(this.onEOF), 100);
	}


	get tempo(): number {
		return this._tempo;
	}

	set tempo(val: number) {
		this._tempo = val;
	}

	public get position(): Quarters {
		if (!this._player || !this._currentMidifile) {
			return 0;
		}
		return this._player.currentTime / this._currentMidifile.header.ticksPerBeat;
	}

	onEvent(playerEvent: any) {
		const ticks = playerEvent.now - DeltaBugFixOffset;
		const position = ticks / this._currentMidifile.header.ticksPerBeat;
		const midiEvent = new MidiEvent();
		// tslint:disable-next-line: no-bitwise
		midiEvent.eventType = playerEvent.message >> 4;
		midiEvent.parameter1 = playerEvent.note;
		midiEvent.parameter2 = playerEvent.velocity;
		midiEvent.channel = playerEvent.channel;
		this.onMidiEvent.emit({position, midiEvent});
		if (playerEvent.now >= playerEvent.end) {
			this.onEofDebounced();
		}
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
					MIDI.Player.addListener(this.onEvent.bind(this));
				}
			});
		});
	}

	private loadFile(midiBase64: string, player): Promise<void> {
		return new Promise((resolve, reject) => {
			player.loadFile('base64,' + midiBase64, resolve);
		}).then(() => {
			this._currentMidifile = MidiFile(player.currentData);
		}, () => {
			this._currentMidifile = null;
		});
	}

	async play(midiBase64: string, event: MouseEvent | KeyboardEvent) {
		const player = await this.getPlayer(event);
		player.BPM = this._tempo;
		await this.loadFile(midiBase64, player);
		console.log(this._currentMidifile);
		fixBrokenDeltaPlayback();	
		player.stop(); // stops all audio being played, and resets currentTime to 0.
		player.start();
		
	}

}
