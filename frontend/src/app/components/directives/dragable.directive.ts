import { Directive, HostListener, EventEmitter } from '@angular/core';
import { Point } from 'src/shared/math/geomentry';


// unfortunately html drag seems not to work with drag/drop

const host = new class {
	currentDragable: DragableDirective = null;
};



/*
	to save resources we have only one host listener for the mouse move event
*/
@Directive({
	selector: '[dragable-position-listnener]'
})
export class PointerPositionListenerDirective {
	@HostListener('window:mousemove', ['$event'])
	onMouseMove(ev: MouseEvent) {
		if (host.currentDragable) {
			host.currentDragable.onMouseMove(ev);
		}
	}
	@HostListener('window:mouseup', ['$event'])
	onMouseUp(ev: MouseEvent) {
		if (host.currentDragable) {
			host.currentDragable.stopDragging(ev);
		}
	}
}

@Directive({
	selector: '[app-dragable]',
	inputs: ['dragPosition', 'dragInverted', 'dragEnabled', 'dragDataContext', 'dragContainerId'],
	outputs: ['onDrop'],
	host: {
		'(mousedown)': 'onMouseDown($event)',
		'(mouseup)': 'onMouseUp($event)'
	}
})
export class DragableDirective {

	dragContainerId: string;
	dragDataContext: any;
	dragPosition: Point;
	lastPosition: Point;
	isDragging: boolean;
	dragInverted: boolean;
	dragEnabled: boolean;
	onDrop: EventEmitter<any[]> = new EventEmitter<any[]>();
	constructor() {
	}


	startDragging(ev: MouseEvent) {
		this.isDragging = true;
		this.lastPosition = this.getEventPosition(ev);
		host.currentDragable = this;
	}

	stopDragging(ev: MouseEvent) {
		this.isDragging = false;
		if (host.currentDragable === this) {
			host.currentDragable = null;
		}
	}

	getEventPosition(ev:MouseEvent): Point {
		let p = new Point(ev.screenX, ev.screenY);
		return p;
	}

	onMouseDown(ev: MouseEvent) {
		if (this.dragEnabled === false) {
			return;
		}
		ev.stopPropagation();
		this.startDragging(ev);
	}

	onMouseUp(ev: MouseEvent) {
		this.stopDragging(ev);
		if (this.isDragAndDropEvent(ev)) {
			this.handleDragAndDrop(this.getDragAndDropSourceData(), this.getDragAndDropTargetData());
		}
	}

	getDragAndDropSourceData() {
		return host.currentDragable.dragDataContext;
	}

	getDragAndDropTargetData() {
		return this.dragDataContext;
	}

	isDragAndDropEvent(ev: MouseEvent) {
		return this.dragDataContext && host.currentDragable && host.currentDragable.dragDataContext;
	}

	handleDragAndDrop(sourceDataContext: any, targetDataContext: any) {
		this.onDrop.emit([sourceDataContext, targetDataContext]);
	}

	onMouseMove(ev: MouseEvent) {
		if (!this.isDragging) {
			return;
		}
		let p = this.getEventPosition(ev);
		if (p.distance(this.lastPosition) > 1) {
			let diff = p.sub(this.lastPosition);
			this.lastPosition = p;
			let op = (this.dragInverted ? this.dragPosition.sub : this.dragPosition.add).bind(this.dragPosition);
			this.dragPosition.assign(op(diff));
		}
	}
}
