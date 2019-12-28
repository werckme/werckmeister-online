import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { WerckService, PlayerStateChange } from 'src/app/services/werck.service';
import { IInstrument } from 'src/shared/werck/instrument';
import { PlayerState } from 'src/shared/werck/player';
import { BackendService } from 'src/app/services/backend.service';
import { MidiEvent, EventType } from 'src/shared/midi/midiEvent';
import { AppConfig } from 'src/config';
import { AppService } from 'src/app/services/app.service';
import { EditorSheetViewModel } from '../../editor/viewmodels/sheet.model';


class Note {
	constructor(public key:number, public octave: number) {
	}

	get noteName(): string {
        let n = this.key;
        switch (n) {
            case 0: return 'c';
            case 1: return 'cis';
            case 2: return 'd';
            case 3: return 'dis';
            case 4: return 'e';
            case 5: return 'f';
            case 6: return 'fis';
            case 7: return 'g';
            case 8: return 'gis';
            case 9: return 'a';
            case 10: return 'ais';
            case 11: return 'b';
        }
	}

	get octavePostfix(): string {
		let oc = this.octave - 2;
		if (oc===0) {
			return '';
		}
		let char = oc < 0 ? ',' : '\'';
		return _.repeat(char, Math.abs(oc));
	}

	toString() : string {
		return `${this.noteName}${this.octavePostfix}`;
	}
}


/**
 * TODO: wenn mehr als eine instance gleichzeitig:
 * refactoring-> keys werden von außen gesetzt: <klavier [pressedKeys]="[....]"
 * so benötigen wir nur ein playerStateChange anstatt jede instance einen eigenen
 */
@Component({
	selector: 'klavier',
	templateUrl: './klavier.component.html',
	styleUrls: ['./klavier.component.scss']
})
export class KlavierComponent implements OnInit {
	koffset: number;
	velocity: number;
	pressedKeys = [];
	werckPositionObserver: any;
	instrument: IInstrument;
	pitches: string[];
	sentNoteOn = new Map<number, boolean>();
	mouseDown = false;
	currentKey: Note;
	typedText: string = '';
	mouseInDeadZone: boolean = false;
	@ViewChild('typePreviewInput')
	typePreviewInput: ElementRef;
	constructor(protected werck: WerckService, protected backend: BackendService, protected app: AppService) { 
		this.koffset = 36;
		this.velocity = 97;
		this.pressedKeys = [];
		this.startEventHighlighter();
		this.werck.playerStateChange.subscribe({next: this.onPlayerStateChanged.bind(this)})
		this.werck.werckChanged.subscribe({next: () => {
			this.instrument = _(this.werck.instruments)
				.find(x => x.name === this.instrumentName);
			if (!this.instrument) {
				this.instrument = this.werck.defaultInstrument;
			} 
		}});
	}

	get instrumentName(): string {
		if (!this.instrument) {
			return null;
		}
		return this.instrument.name;
	}

	onKeyboard(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			this.resetTyping();
		}
	}

	submitTyping() {
		this.writeToEditor(this.typedText);
		this.typedText = '';
	}

	resetTyping() {
		this.typedText = '';
	}

	ngOnInit() {}

	onPlayerStateChanged(stateChange: PlayerStateChange) {
		if (stateChange.to === stateChange.from) {
			return;
		}
		if (stateChange.to === PlayerState.Stopped) {
			this.stopEventHighlighter();
		}
		if (stateChange.to === PlayerState.Playing) {
			this.startEventHighlighter();
		}
	}

	getKeyId(nr, octave) {
		return octave * 12 + nr + this.koffset;
	}

	onEnter(nr, octave) {
		if (!this.mouseDown) {
			return;
		}
		// this.sendNoteOn(this.getKeyId(nr, octave));
	}

	onKey(nr, octave, event: MouseEvent) {
		event.preventDefault();
		this.mouseDown = true;
		this.currentKey = new Note(nr, octave);
		this.sendNoteOn(this.getKeyId(nr, octave));
	}

	onKeyUp() {
		this.mouseDown = false;
		this.sentNoteOn.forEach((pressed, pitch) => {
			this.sendNoteOff(pitch);
		});
		this.typeNote(this.currentKey);
	}

	typeNote(note: Note) {
		if (this.mouseInDeadZone || !this.app.currentEditor) {
			return;
		}
		this.typedText += `${note.toString()} `;
		setTimeout(() => {
			this.typePreviewInput.nativeElement.focus();
		});
	}

	writeToEditor(text: string) {
		if (!this.app.currentEditor) {
			return;
		}
		let model = this.app.currentEditor;
		if (!(model instanceof EditorSheetViewModel)) {
			return;
		}
		
		model.editor.insert(text);
	}

	sendNoteOn(pitch: number) {
		if (this.mouseInDeadZone) {
			return;
		}
		if (!this.instrument) {
			return;
		}
		let ev = new MidiEvent();
		ev.eventType = EventType.NoteOn;
		ev.parameter1 = pitch;
		ev.parameter2 = AppConfig.KeyboardVelocity;
		ev.channel = this.instrument.channel;
		this.sentNoteOn.set(ev.parameter1, true);
	}

	sendNoteOff(pitch: number) {
		if (!this.instrument) {
			return;
		}
		let ev = new MidiEvent();
		ev.eventType = EventType.NoteOn;
		ev.parameter1 = pitch;
		ev.parameter2 = 0;
		ev.channel = this.instrument.channel;
		this.sentNoteOn.delete(pitch);

	}

	getClasses(nr, octave) {
		let key = this.getKeyId(nr, octave);
		let res = [`k${key}`];
		return res;
	}

	updateEvents() {
		if (!this.instrument) {
			return;
		}
		this.pitches = _(this.werck.currentEvents)
			.filter(x => x.instrumentId === this.instrument.id && x.channel === this.instrument.channel)
			.map(x => _(x.pitches).map(pitch=>`k${pitch}`).value())
			.flatten()
			.value();
	}

	startEventHighlighter() {
		if (this.werckPositionObserver) {
			return;
		}
		this.werckPositionObserver = this.werck.noteOnChange.subscribe({
			next: this.updateEvents.bind(this)
		});
	}

	stopEventHighlighter() {
		if (!this.werckPositionObserver) {
			return;
		}
		this.werckPositionObserver.unsubscribe();
		this.werckPositionObserver = null;
		this.pitches = [];
	}

}
