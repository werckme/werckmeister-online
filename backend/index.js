const { spawn } = require('child_process');
const path = require('path')
const WerckmeisterBinaries = "/home/samba/workspace/werckmeister/build";
const WMCompilerBin = path.join(WerckmeisterBinaries, 'sheetc');


const testsheet =
    `
using "./com/myChords.chords";
device: SC1 midi 2;

tempo: 130;
instrumentDef: piano   SC1 2 0 0;

[
instrument: piano;
{
    c d e f | g a b c' |
}
]

`

const testchords =
    `
------------------------------------------------------------------
X: 			I=0	    		III=4 			V=7
Xmin: 		I=0     		III=3 			V=7
X-: 		I=0     		III=3 			V=7
X/7: 		I=0     		III=4 			V=7 			VII=-2
X-/7: 		I=0     		III=3 			V=7 			VII=-2
X/maj7: 	I=0          	III=4 			V=7 			VII=-1
X/5: 		I=0	    		III=4 			V=-5
X-/5: 		I=0	    		III=3 			V=-5
X/4: 		I=0	    		III=4 	IV=-7	V=7
X-/4: 		I=0	    		III=3 	IV=-7	V=7
X/3: 		I=0	    		III=-8 	    	V=7
X-/3: 		I=0	    		III=-9 	    	V=7
X/2: 		I=0	    II=-10	III=4 	    	V=7
`


function executeCompiler(jsonData) {
    return new Promise((resolve, reject) => {
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
        const result = await executeCompiler([
            {
                path: "myfile.sheet",
                data: testsheet
            }
            ,
            {
                path: "./com/myChords.chords",
                data: testchords
            }
        ]);
        console.log(result);
    } catch (ex) {
        console.log(ex);
    }
}

main();