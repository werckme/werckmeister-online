
const fs = require("fs");
var path = require('path');
const files = process.argv.slice(2, process.argv.length)

resultJson = [];

for(const file of files) {
    const name = path.basename(file);
    resultJson.push({
        path: name,
        data: fs.readFileSync(file).toString()
    });
}
console.log(resultJson)
console.log(Buffer.from(JSON.stringify(resultJson)).toString('base64'))