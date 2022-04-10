const fs = require("fs");
const path = require('path');
const presetDir = './presets';
const externalResourcesDir = './externalResources';

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

function getWorkspace(presetName) {
    return loadWorkspaceFiles(presetName);
}

function listPresets() {
    return fs.readdirSync(presetDir)
}

function listExternalResources() {
    return fs.readdirSync(externalResourcesDir)
}

module.exports = { getWorkspace, listPresets, listExternalResources }