import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IInstrument } from 'src/shared/werck/instrument';
import { ITrack } from 'src/shared/werck/track';
import { WerckService } from 'src/app/services/werck.service';

class TrackOption {
	track: ITrack;
	instruments: IInstrument[] = [];
}

@Component({
	selector: 'instrument-select',
	templateUrl: './instrument-select.component.html',
	styleUrls: ['./instrument-select.component.scss']
})
export class InstrumentSelectComponent implements OnInit {
	private instrument_: IInstrument;
	@Input()
	set instrument(val: IInstrument) {
		this.instrument_ = val;
		this.instrumentChange.emit(this.instrument);
	}
	get instrument(): IInstrument  {
		return this.instrument_;
	}

	@Output()
	instrumentChange = new EventEmitter<IInstrument>();
	trackOptions = new Map<number, TrackOption>();
	trackOption: TrackOption;
	constructor(public werck: WerckService) {
	}

	ngOnInit() {
	}
}
