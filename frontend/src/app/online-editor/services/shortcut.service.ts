import { Injectable } from '@angular/core';
import * as _ from 'lodash';

abstract class State {
	abstract pathId: string;
	nextStates: Array<State> = new Array<State>();
	abstract matches(event: KeyboardEvent): boolean;
	_callback: Function;
	char(val: string): State {
		let newState = new Char();
		newState._char = val;
		return this.pushState(newState);
	}

	pushState(newState: State): State {
		let existing = _(this.nextStates).find(x => x.pathId === newState.pathId);
		if (existing) {
			return existing;
		}
		this.nextStates.push(newState);
		return newState;
	}

	ctrl() {
		let newState = new Ctrl();
		return this.pushState(newState);
	}

	ctrlAndChar(val: string): State {
		let newState = new CtrlAndChar();
		newState.charState._char = val;
		return this.pushState(newState);
	}

	altAndChar(val: string): State {
		let newState = new AltAndChar();
		newState.charState._char = val;
		return this.pushState(newState);
	}

	shiftCtrlAndChar(val: string): State {
		let newState = new ShiftCtrlAndChar();
		newState.charState._char = val;
		return this.pushState(newState);
	}

	shiftAltAndChar(val: string): State {
		let newState = new ShiftAltAndChar();
		newState.charState._char = val;
		return this.pushState(newState);
	}

	anyDigit(): State {
		let newState = new AnyDigit();
		return this.pushState(newState);
	}

	then(): State {
		return this;
	}

	thenExecute(callback: Function) {
		this._callback = callback;
	}

	fire(event: KeyboardEvent) {
		if (this._callback) {
			this._callback();
		}
	}

	get isLast(): boolean {
		return this.nextStates.length === 0;
	}
}

class StateMachine {
	current: State;
	start: State = new Start();
	constructor() {
		this.reset();
	}
	input(event: KeyboardEvent) {
		for (let state of this.current.nextStates) {
			if (state.matches(event)) {
				event.preventDefault();
				this.current = state;
				state.fire(event);
				if (state.isLast) {
					this.reset();
				}
				return;
			}
		}
		// no match
		this.reset();
	}

	reset() {
		this.current = this.start;
	}
}

export class Char extends State {
	get pathId(): string {
		return `Char:${this._char}`;
	}
	_char: string;
	matches(event: KeyboardEvent): boolean {
		return event.key === this._char;
	}
}

export class AnyDigit extends State {
	get pathId(): string {
		return `AnyDigit`;
	}
	_digit: number;
	matches(event: KeyboardEvent): boolean {
		this._digit = Number.parseInt(event.key);
		return !Number.isNaN(this._digit);
	}

	fire(event: KeyboardEvent) {
		if (this._callback) {
			this._callback(this._digit);
		}
	}
}

export class Ctrl extends State {
	get pathId(): string {
		return 'Ctrl';
	}
	matches(event: KeyboardEvent): boolean {
		return event.key === 'Control';
	}
}

export class CtrlAndChar extends Ctrl {
	charState: Char = new Char();
	get pathId(): string {
		return 'Ctrl' + this.charState.pathId;
	}
	matches(event: KeyboardEvent): boolean {
		return this.charState.matches(event) && event.ctrlKey;
	}
}

export class AltAndChar extends Ctrl {
	charState: Char = new Char();
	get pathId(): string {
		return 'Alt' + this.charState.pathId;
	}
	matches(event: KeyboardEvent): boolean {
		return this.charState.matches(event) && event.altKey;
	}
}

export class ShiftCtrlAndChar extends Ctrl {
	charState: Char = new Char();
	get pathId(): string {
		return 'SCtrl' + this.charState.pathId;
	}
	matches(event: KeyboardEvent): boolean {
		return this.charState.matches(event) && event.ctrlKey && event.shiftKey;
	}
}

export class ShiftAltAndChar extends Ctrl {
	charState: Char = new Char();
	get pathId(): string {
		return 'SAlt' + this.charState.pathId;
	}
	matches(event: KeyboardEvent): boolean {
		return this.charState.matches(event) && event.altKey && event.shiftKey;
	}
}

export class Start extends State {
	pathId:string = 'Start';
	matches(event: KeyboardEvent): boolean {
		return true;
	}
}

/*
  StateMachine, fluent:
  
  // ctrl + k
  when().ctrl().and().k().thenFire(onEvent);
  
  // ctrl + k then f 
  when().ctrl().and().k().then().f().thenFire(onEvent)
  
  // ctrl + k then n, optional 0-9 digit
  // (blender style eg.: r (for rotate) x (for x axis) 90 
  when().ctrl().and().k().then().n().thenFire(() => {
    // obj = new Object();
    return optional().digit().thenFire((digit) => {
       obj.setNumber(digit);
    });
  });
*/
@Injectable({
	providedIn: 'root'
})
export class ShortcutService {

	private sm: StateMachine = new StateMachine();

	constructor() { 
		window.addEventListener('keydown', this.onKeyEvent.bind(this));
	}

	onKeyEvent(event: KeyboardEvent) {
		this.sm.input(event);
	}

	when(): State {
		return this.sm.start;
	}
}
