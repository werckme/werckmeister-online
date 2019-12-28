var args = process.argv.slice(2);
if (args.length < 1) {
    throw new Error("missing port argument");
}
const port = Number.parseInt(args[0]);
if (!port) {
    throw new Error("invalid port: " + args[0]);
}

const { spawn } = require('child_process');
const path = require('path')
const express = require('express');
const cors = require('cors')
const app = express();
//const config = require('config');
const resolve = require('path').resolve;
const join = require('path').join;

const WerckmeisterBinaries = "/home/samba/workspace/werckmeister/build";
const WMCompilerBin = path.join(WerckmeisterBinaries, 'sheetc');


function handle(res, func) {
    func().catch((ex)=> {
        res.status(500).send(ex.message);
    });
}
app.use(cors());
app.use(express.json())

function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch(ex) {
        return null;
    }
}

function executeCompiler(jsonData) {
    return new Promise((resolve, reject) => {
        let result = "";
        jsonData = JSON.stringify(jsonData);
        jsonData = Buffer.from(jsonData).toString('base64');
        const pobj = spawn(WMCompilerBin, [jsonData, '--mode=json', '--nometa']);

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


app.post('/api/compile', function name(req, res) {
    let result = null;
    handle(res, async () => {
        try {
            result = await executeCompiler(req.body);
            console.log(result);
        } catch(ex) {
            result = ex;
            res.statusCode = 500;
        }
        result = tryParseJSON(result);
        res.send(result);
    });
});

const server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("listening at http://%s:%s", host, port)
});