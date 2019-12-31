import { Component, OnInit } from '@angular/core';
import { WerckService } from 'src/app/services/werck.service';
import { Router } from '@angular/router';
import { ATutorial } from '../tutorial/ATutorial';
import { IFile } from 'src/shared/io/file';

const snippet = 
  `
  using "chords/default.chords";
  using "lua/voicings/voicelead.lua";

  tempo: 140;
  device: MyDevice  midi 0;
  instrumentDef:lead  MyDevice  0 0 0;
  instrumentDef:piano  MyDevice  0 0 0;
  
  instrumentConf: piano
    voicingStrategy voicelead range tenor;

  [
  instrument: piano;
  {
    \\fff
    r4 e f# g | c'1~ | c'4 d e f# | b2 b2~ | b4 c d e | a1~ | a4 b, c# d# | g1 |
    -- wiederholung
    r4 e f# g | c'1~ | c'4 d e f# | b2 b2~ | b4 c d e | a1~ | 
    -- 2.
    a4 f# a g | e1~ | e4 r d# e | f# b, f#2~ | f#4 f# e f# | g1~ | g4 g f# g | a1~ |
    a4 d d' c' | b1~ | b4 r a# b | c' c' a a | f#2. c'4 | b2 b2~ | b2. e4 | a2. g4 | 
    f#2 g4 b, | e1 
  }
  ]

  [
    type: template;
    name: x;
    instrument: piano;
    {
        \\f
        <I II III IV V VI VII>1 |
    }
    ]
    
    [
    type: accomp;
    {   
      r | A-7 | D7 | Gmaj7 | Cmaj7 | F#-7b5 | B7 | E- | E- |
      -- wiederholung
      A-7 | D7 | Gmaj7 | Cmaj7 | F#-7b5  | 
      -- 2.
      B7 | E- | E- | F#-7b5  | B7b9 | E- | E- | A-7 | D7 | Gmaj7 | Gmaj7 |
      F#-7b5  | B7b9 | E-7 Eb7 | D-7 Db7 | Cmaj7 | B7b9 | E- |
    }
    ]
  `
  ;


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends ATutorial implements OnInit {

	files: IFile[] = [];
	constructor(werck: WerckService, route: Router) {
		super(route, werck);
	}

	async ngOnInit() {
    const text = this.prepareSnippet(snippet);
    const file = await this.werck.createSnippetFile(text, 'blackpages.sheet');
    this.files.push(file);
	}

}
