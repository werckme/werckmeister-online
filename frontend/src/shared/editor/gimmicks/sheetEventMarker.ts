import { IEditor, IMarker, ITextPosition, IRange } from '../IEditor';
import { MarkerOptions } from '../MarkerOptions';
import { IEventLocation } from '../EventLocation';
import { createMarkerId, allMarkersOff } from '../Ace/Marker';
import { WerckService } from 'src/app/services/werck.service';
import * as _ from 'lodash';
import { IFile, IEventInfo, ISheetEventInfo } from 'src/shared/io/file';
import { SheetInspector } from '../SheetInspector';


export class SheetEventMarkerManager {
	markers:any = {};
	werckPositionObserver: any;
	inspector: SheetInspector;
	constructor(public file: IFile, public editor: IEditor, public werck: WerckService) {
		this.inspector = new SheetInspector(editor);
	}

	get isObserving(): boolean {
		return !!this.werckPositionObserver;
	}

	restoreMarkers(file: IFile, editor: IEditor, werck: WerckService) {
		this.file = file;
		this.editor = editor;
		this.werck = werck;
		// tslint:disable-next-line: forin
		for (const key in this.markers) {
			const marker: IMarker = this.markers[key];
			this.editor.addMarker(marker);
		}
	}

	startEventPositionHighlighter() {
		if (this.isObserving) {
			return;
		}
		this.werckPositionObserver = this.werck.noteOnChange.subscribe({
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
		for (const marker of markers) {
			marker.setMarked(val);
		}
	}

	getMarkersByPosition(positions: IEventLocation[]): IMarker[] {
		return _(positions)
			.map(x => this.markers[createMarkerId(x.row, x.column)])
			.filter(x => !!x)
			.value();
	}

	private _eventInfosToEventLocations(infos: IEventInfo[]) {
		let eventInfos = _(infos)
			.map((x: IEventInfo) => x.sheetEventInfos)
			.flatten()
			.uniqBy(x => `${x.sourceId}-${x.beginPosition}`)
			.value()
		;
		const rowsAndClolumns = this.inspector.getRowAndColumns(eventInfos.map(x=>x.beginPosition));
		const locations = [];
		for (let idx = 0; idx < rowsAndClolumns.length; ++idx) {
			locations.push({
				sourceId: eventInfos[idx].sourceId,
				row: rowsAndClolumns[idx].row,
				column: rowsAndClolumns[idx].col
			});
		}
		return locations;
	}

	updateEventMarkers() {
		this.markers = {};
		const eventInfos = this.werck.getEvents(this.file);
		const locations = this._eventInfosToEventLocations(eventInfos);
		this.addEventMarkers(locations);
	}

	updateEventMarkerStates() {
		const eventInfos = this.werck.getEventsAtCurrentTime();
		if (!eventInfos) {
			allMarkersOff();
			return;
		}
		const locations = this._eventInfosToEventLocations([eventInfos]);
		const nextMarkers = this.getMarkersByPosition(locations);
		allMarkersOff();
		this.setMarkersEnabled(nextMarkers, true);
	}

	addEventMarker(row: number, column: number): IMarker {
		const range = this.editor.getTokenRange(row, column, 'event');
		const marker = this.editor.createMarker(range, new MarkerOptions());
		this.editor.addMarker(marker);
		this.markers[createMarkerId(range.start.row, range.start.column)] = marker;
		return marker;
	}

	addEventMarkers(locations: IEventLocation[]): IMarker[] {
		const result = [];
		for (const location of locations) {
			const marker = this.addEventMarker(location.row, location.column);
			result.push(marker);
		}
		return result;
	}
}
