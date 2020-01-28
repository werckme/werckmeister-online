import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './components/partials/editor/editor.component';
import { BackendService } from './services/backend.service';
import { ShortcutService } from './services/shortcut.service';
import { MainComponent } from './components/pages/main.component';
import { TransportComponent } from './components/partials/daw/transport/transport.component';
import { FilelistComponent } from './components/partials/filelist/filelist.component';
import { ConsoleComponent } from './components/partials/console/console.component';
import { KlavierComponent } from './components/partials/daw/klavier/klavier.component';
import { InstrumentSelectComponent } from './components/partials/daw/instrument-select/instrument-select.component';
import { DragableDirective, PointerPositionListenerDirective } from './components/directives/dragable.directive';
import { FolderComponent } from './components/partials/folder/folder.component';
import { TutorialsnippetComponent } from './components/partials/help/tutorialsnippet/tutorialsnippet.component';
import { ExpressionComponent } from './components/partials/help/expression/definition.component';
import { TipComponent } from './components/partials/help/tip/tip.component';
import { MenupathComponent } from './components/partials/help/menupath/menupath.component';
import { TutorialTocComponent } from './components/pages/tutorial/toc/toc.component';
import { MidiConfigComponent } from './components/pages/tutorial/first-steps/midi/midi-config.component';
import { NotesComponent } from './components/pages/tutorial/notation/notes/notes.component';
import { InstrumentComponent } from './components/pages/tutorial/first-steps/instrument/instrument.component';
import { AccordionComponent } from './components/partials/accordion/accordion.component';
import { SelectMidiComponent } from './components/pages/tutorial/selectmidi/selectmidi.component';
import { TracksComponent } from './components/pages/tutorial/notation/tracks/tracks.component';
import { TemplatesComponent } from './components/pages/tutorial/templates/templates/template.component';
import { ChordDefComponent } from './components/pages/tutorial/templates/chorddef/chorddef.component';
import { PitchmapComponent } from './components/pages/tutorial/notation/pitchmap/pitchmap.component';
import { VoicingsComponent } from './components/pages/tutorial/templates/voicings/voicings.component';
import { TocComponent } from './components/partials/help/toc/toc.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SnippedComponent } from './components/partials/help/snipped/snipped.component';
import { EditorComponent as EditorPageComponent } from './components/pages/editor/editor.component';
import { WmcodeDirective } from './directives/wmcode.directive';
import { ManualComponent } from './components/pages/manual/manual.component';

@NgModule({
	declarations: [
		AppComponent,
		EditorComponent,
		MainComponent,
		TransportComponent,
		FilelistComponent,
		ConsoleComponent,
		KlavierComponent,
		InstrumentSelectComponent,
		DragableDirective,
		PointerPositionListenerDirective,
		FolderComponent,
		TutorialsnippetComponent,
		ExpressionComponent,
		TipComponent,
		MenupathComponent,
		ExpressionComponent,
		MenupathComponent,
		TipComponent,
		TutorialTocComponent,
		MidiConfigComponent,
		NotesComponent,
		InstrumentComponent,
		AccordionComponent,
		SelectMidiComponent,
		TracksComponent,
		TemplatesComponent,
		ChordDefComponent,
		PitchmapComponent,
		VoicingsComponent,
		TocComponent,
		HomeComponent,
		HeaderComponent,
		SnippedComponent,
		EditorPageComponent,
		WmcodeDirective,
		ManualComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		NgbModule,
		HttpClientModule
	],
	providers: [BackendService, ShortcutService],
	bootstrap: [AppComponent]
})
export class AppModule { }
