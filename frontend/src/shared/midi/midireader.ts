import { Player } from 'midi-player-js';
import { IFile, IBinaryFileContent } from '../io/file';
import { BinaryFileContent } from '../io/fileContent';

export class MidiFileReader {
    constructor(file: IFile) {
        if (!file.hasContent || !(file.content instanceof BinaryFileContent)) {
            throw new Error("try to open wrong file format");
        }
        let midifileData = file.content as BinaryFileContent;
        let player = new Player();
        player.division = 500;
        player.tempo = 120;
        // freezes, I guess the problem are unkown meta events which we use
        player.loadArrayBuffer(midifileData.data.buffer);

    }
}