import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

interface IFile {
  path: string;
  data: string;
}

const files = [{
  path: "main.sheet",
  data: `using "chords/default.chords";
using "simpleComping.template";
tempo: 140;
device: MyDevice  midi _usePort=0;
instrumentDef:lead    _onDevice=MyDevice  _ch=0 _pc=0;
instrumentDef:rhtythm _onDevice=MyDevice  _ch=1 _pc=0;
instrumentDef:bass    _onDevice=MyDevice  _ch=2 _pc=0;

-- melody track
[
instrument: lead;
{
    \\fff
    r4 e f# g  | c'1~       | c'4 d e f#  | b2 b2~ | 
    b4 c d e   | a1~        | a4 b, c# d# | g1     |
    r4 e f# g  | c'1~       | c'4 d e f#  | b2 b2~ | 
    b4 c d e   | a1~        | a4 f# a g   | e1~    |
    e4 r d# e  | f# b, f#2~ | f#4 f# e f# | g1~    |
    g4 g f# g  | a1~        | a4 d d' c'  | b1~    | 
    b4 r a# b  | c' c' a a  | f#2. c'4    | b2 b2~ | 
    b2. e4     | a2. g4     | f#2 g4 b,   | 
    e1 
}
]

-- accomp track
[
type: accomp;
{   
    r      | A-7    | D7    | Gmaj7  | 
    Cmaj7  | F#-7b5 | B7    | E-     | 
    E-     | A-7    | D7    | Gmaj7  | 
    Cmaj7  | F#-7b5 | B7    | E-     | 
    E-     | F#-7b5 | B7b9  | E-     | 
    E-     | A-7    | D7    | Gmaj7  |
    Gmaj7  | F#-7b5 | B7b9  | E-7 A7 | 
    D-7 G7 | F#-7b5 | B7b9  | E-     |
}
]`
}, {
  path: "simpleComping.template",
  data: `-- the templates defines what the accomp track has to play
[
type: template;
name: myAccomp;
instrument: bass;
{
    I,,2. V,,4 |
}
]`
}];

@Component({
  selector: 'ngwerckmeister-online-editor',
  templateUrl: './online-editor.component.html',
  styleUrls: ['./online-editor.component.scss']
})
export class OnlineEditorComponent implements OnInit, AfterViewInit {
  @ViewChild("editorMain", { read: ViewContainerRef, static: false }) editorMain: ViewContainerRef;
  @ViewChild("workspace", { read: ViewContainerRef, static: false }) workspace: ViewContainerRef;
  
  files: IFile[] = files;  
  currentFile: IFile = files[0];

  constructor() { }


  ngAfterViewInit(): void {
    this.updateWorkspace();
  }

  ngOnInit() {
  }

  private updateWorkspace() {
    const workspace = this.workspace.element.nativeElement as any;
    const editorsContainer:HTMLElement = this.editorMain.element.nativeElement;
    const editors = editorsContainer.getElementsByTagName('werckmeister-editor');
    for(const editor of Array.from(editors)) {
      workspace.registerEditor(editor);
    }
  }

  onFileClicked(file: IFile) {
    this.currentFile = file;
  }

}
