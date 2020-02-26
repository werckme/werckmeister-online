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
const config = require('config');
var bodyParser = require('body-parser')

const WerckmeisterBinaries = config.werckmeister.bin;
const WMCompilerBin = path.join(WerckmeisterBinaries, 'sheetc');


function handle(res, func) {
    func().catch((ex)=> {
        res.status(500).send(ex.message);
    });
}
app.use(cors());
app.use(express.json({limit: '100kb'}))


function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch(ex) {
        return null;
    }
}

function executeCompiler(args) {
    return new Promise((resolve, reject) => {
        let result = "";
        const pobj = spawn(WMCompilerBin, args);

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
                console.log(result);
                reject(result);
            }
        });
    });
}


app.post('/api/compile', function name(req, res) {
    let result = null;
    handle(res, async () => {
        try {
            let jsonData = JSON.stringify(req.body);
            jsonData = Buffer.from(jsonData).toString('base64');
            args = [jsonData, '--mode=json', '--nometa'];
            result = await executeCompiler(args);
        } catch(ex) {
            result = ex;
            res.statusCode = 500;
        }
        result = tryParseJSON(result);
        res.send(result);
    });
});

app.get('/api/version', function name(req, res) {
    let result = null;
    handle(res, async () => {
        try {
            result = await executeCompiler(['--version']);
            result = result.replace(/\n/g, '');
        } catch(ex) {
            result = ex;
            res.statusCode = 500;
        }
        result = {version: result};
        res.send(result);
    });
});

const server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("listening at http://%s:%s", host, port)
});