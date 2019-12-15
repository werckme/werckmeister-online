import { environment } from './environments/environment';

export const AppConfig = {
    WerckPositionPollingMillis: 50,
    EditorUpdateContentDebounceMillis: 100,
    EditorFontSizePx: 16,
    KeyboardVelocity: 70,
    knownExtensions: {
        sheet: ".sheet",
        template: ".template",
        chordDef: ".chords",
        pitchmap: ".pitchmap",
        lua: ".lua",
        midi: ".midi",
        tutorial: ".tut"
    },
    Tutorial: {
        defaultMidiPort: environment.defaultMidiport
    }
}