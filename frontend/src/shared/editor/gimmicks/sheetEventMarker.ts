import { IEditor, IMarker, ITextPosition, IRange } from '../IEditor';
import { MarkerOptions } from '../MarkerOptions';
import { IEventInfo } from '../EventLocation';
import { createMarkerId, allMarkersOff } from '../Ace/Marker';
import { WerckService } from 'src/app/services/werck.service';
import * as _ from 'lodash';
import { IFile } from 'src/shared/io/file';


export class SheetEventMarkerManager {
	markers = {};
	werckPositionObserver: any;
	constructor(public file: IFile, public editor: IEditor, public werck: WerckService) {

	}

	get isObserving(): boolean {
		return !!this.werckPositionObserver;
	}

	restoreMarkers(file: IFile, editor: IEditor, werck: WerckService) {
		this.file = file;
		this.editor = editor;
		this.werck = werck;
		for(let key in this.markers) {
			let marker:IMarker = this.markers[key];
			this.editor.addMarker(marker);
		}
	}

	startEventPositionHighlighter() {
		if (this.isObserving) {
			return;
		}
		this.werckPositionObserver = this.werck.positionChange.subscribe({
			next: this.updateEventMarkerStates.bind(this)
		});
	}

	stopEventPositionHighlighter() {
		if (!this.isObserving) {
			return;
		}
		this.werckPositionObserver.unsubscribe();
		this.werckPositionObserver = null;
	}

	getEnabledMarkers(): IMarker[] {
		return _(this.markers)
			.filter(x => x.marked)
			.value();
	}

	setMarkersEnabled(markers: IMarker[], val: boolean) {
		for (let marker of markers) {
			marker.setMarked(val);
		}
	}

	getMarkersByPosition(positions: IEventInfo[]): IMarker[] {
		return _(positions)
			.filter( x => x.sourceId === this.file.sourceId )
			.map(x => this.markers[createMarkerId(x.row, x.column)])
			.filter(x => !!x)
			.value();
	}

	async updateEventMarkers() {
		if (this.file.isNew) {
			// a new (unsaved) file can not have any events to mark
			return;
		}
		this.markers = {};
		let positions = await this.werck.getEvents(this.file);
		this.addEventMarkers(positions);
	}

	async updateEventMarkerStates() {
		let events = await this.werck.getEventsAtCurrentTime();
		let nextMarkers = this.getMarkersByPosition(events);
		allMarkersOff();
		this.setMarkersEnabled(nextMarkers, true);
	}

	addEventMarker(row: number, column: number): IMarker {
		let range = this.editor.getTokenRange(row, column, "event");
		let marker = this.editor.createMarker(range, new MarkerOptions());
		this.editor.addMarker(marker);
		this.markers[createMarkerId(range.start.row, range.start.column)] = marker;
		return marker;
	}

	addEventMarkers(locations: IEventInfo[]): IMarker[] {
		let result = [];
		for (let location of locations) {
			let marker = this.addEventMarker(location.row, location.column);
			result.push(marker);
		}
		return result;
	}
}