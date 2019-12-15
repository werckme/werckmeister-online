import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

export const TutorialTocUrl = "/help/tutorial";

export const TutorialToc = [
    { chapter: "First steps", title:"MIDI config", route: '/help/tutorial/midiconfig' }, 
    { chapter: "First steps", title:"Setup an instrument", route: '/help/tutorial/instrument' },
	{ chapter: "Notation", title:"Write notes", route: '/help/tutorial/notation' },
	{ chapter: "Notation", title:"Tracks", route: '/help/tutorial/tracks' },
	{ chapter: "Notation", title:"Define Pitchmaps", route: '/help/tutorial/pitchmap' },
	{ chapter: "Templates", title:"Use Templates/Accompaniment", route: '/help/tutorial/templates' },
	{ chapter: "Templates", title:"Voicing strategies", route: '/help/tutorial/chorddef' },
	{ chapter: "Templates", title:"Define Chords", route: '/help/tutorial/voicings' }
]



@Component({
	selector: 'tutorial-toc-elements',
	templateUrl: './toc.component.html',
	styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit {

	tree: {};
	chapters: string[];
	constructor() { }

	createTree() {
		this.tree = _(TutorialToc).groupBy(x => x.chapter).value();
	}

	ngOnInit() {
		this.createTree();
	}

}
