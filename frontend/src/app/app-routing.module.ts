import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from './components/pages/main/intro/intro.component';
import { MainEditorComponent } from './components/pages/main/main-editor/main-editor.component';
import { TutorialTocComponent } from './components/pages/tutorial/toc/toc.component';
import { MidiConfigComponent } from './components/pages/tutorial/first-steps/midi/midi-config.component';
import { InstrumentComponent } from './components/pages/tutorial/first-steps/instrument/instrument.component';
import { NotesComponent } from './components/pages/tutorial/notation/notes/notes.component';
import { SelectMidiComponent } from './components/pages/tutorial/selectmidi/selectmidi.component';
import { TracksComponent } from './components/pages/tutorial/notation/tracks/tracks.component';
import { PitchmapComponent } from './components/pages/tutorial/notation/pitchmap/pitchmap.component';
import { TemplatesComponent } from './components/pages/tutorial/templates/templates/template.component';
import { ChordDefComponent } from './components/pages/tutorial/templates/chorddef/chorddef.component';
import { VoicingsComponent } from './components/pages/tutorial/templates/voicings/voicings.component';



const routes: Routes = [
	{ path: '', component: IntroComponent },
	{ path: 'help/tutorial', component: TutorialTocComponent },
	{ path: 'help/tutorial/midiconfig', component: MidiConfigComponent },
	{ path: 'help/tutorial/instrument', component: InstrumentComponent },
	{ path: 'help/tutorial/notation', component: NotesComponent },
	{ path: 'help/tutorial/tracks', component: TracksComponent },
	{ path: 'help/tutorial/pitchmap', component: PitchmapComponent },
	{ path: 'help/tutorial/selectmidi', component: SelectMidiComponent },
	{ path: 'help/tutorial/templates', component: TemplatesComponent },
	{ path: 'help/tutorial/voicings', component: VoicingsComponent },
	{ path: 'help/tutorial/chorddef', component: ChordDefComponent },
	{ path: 'editor', component: MainEditorComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
