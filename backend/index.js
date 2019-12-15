const { spawn } = require('child_process');
const path = require('path')
const WerckmeisterBinaries = "/home/samba/workspace/werckmeister/build";
const WMCompilerBin =  path.join(WerckmeisterBinaries, 'sheetc');


const testsheet = 
`
using "./chords/default.chords";
using "lua/mods/myArpeggio.lua";
using "lua/voicings/voicelead.lua";

device: SC1 midi 2;

tempo: 130;
instrumentDef: piano   SC1 2 0 0;
instrumentConf: piano
    voicingStrategy voicelead
;

[
type: template;
name: x;
instrument: piano; 
{
    /doOnce: myArpeggio style legato direction up/  
    \fff
    <I II III V VI VII>8~<I II III V VI VII>2. ~<I II III V VI VII>8 |
    \p
    /doOnce: myArpeggio style legato direction up/  
    <I II III IV V VI VII>4~ <I II III IV V VI VII>2 r4  |
}   
]

[
type: template;
name: y;
instrument: piano; 
{ 
    \p
    <I II III IV V VI VII>1
}   
]

[
type: accomp;
{
    /template: x/
    C-7 | E-7 | C-7 | E-7 | C-7 | Gmaj7 | Bmaj7 | 
    /template: y/
    Cb7 | 
}   
]
`

function executeCompiler(jsonData) {
    return new Promise((resolve, reject)=>{
        let result = "";
        const pobj = spawn(WMCompilerBin, [JSON.stringify(jsonData), '--mode=json']);

        pobj.stderr.on('data', (data) => {
            result += data;
        });

        pobj.stdout.on('data', (data) => {
            result += data;
        });

        pobj.on('exit', (code) => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    });
}

async function main() {
    try {
    const result = await executeCompiler([{
        path: "myfile",
        data: testsheet
    },
    {
        path: "myfile2",
        data: "xyz"
    }
]);
    console.log(result);
    } catch (ex) {
        console.log(ex);
    }
}

main();