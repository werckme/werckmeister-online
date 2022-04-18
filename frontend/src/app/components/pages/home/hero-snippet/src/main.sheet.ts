export const MainSheet = `[
{
    c'4   g8 g   a4 g~  |   g  b c'~ | c'1
}
]

[
type: accomp;
{
    C | G | C
}
]`;

export const AdditionalFiles = [
    {
        path: "comping1.template",
        data: `[
type: template;
name: myAccomp;
instrument: rhtythm;
{
    <III V VII II'>1 | 
}
]

[
type: template;
name: myAccomp;
instrument: bass;
{
    I,,2. V,,4 | I,,2. V,,4  | I,,1
}
]`
    }
];

export const DefLinesTemplate = `using "comping1.template";
using "chords/default.chords";
tempo: 140;
device: MyDevice  midi _usePort=0;
instrumentDef:lead    _onDevice=MyDevice  _ch=0 _pc=0;
instrumentDef:rhtythm _onDevice=MyDevice  _ch=1 _pc=16;
instrumentConf: rhtythm volume 50;
instrumentDef:bass    _onDevice=MyDevice  _ch=2 _pc=32;
instrumentConf: bass volume 50;
`;