const fs = require("fs");
const path = require('path');
const presetDir = './presets';

function loadWorkspaceFiles(presetFolder) {
    const target = path.join(presetDir, presetFolder);
    const dir = fs.readdirSync(target).sort((a, b) => {
        if (a === 'main.sheet') return -1;
        if (b === 'main.sheet') return 1;
        return a.localeCompare(b);
    });
    return {
        files: dir.map(file => ({
            path: file,
            data: fs.readFileSync(`${target}/${file}`).toString()
        }))
    };
}

function GetWorkspace(presetName) {
    return loadWorkspaceFiles(presetName);
}

module.exports = GetWorkspace;