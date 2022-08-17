const fs = require("fs");
const path = require('path');
const presetDir = './presets';
const externalResourcesDir = './externalResources';
const templateDir = './style-templates';

function loadWorkspaceFiles(presetFolder) {
    const target = path.join(presetDir, presetFolder);
    const dir = fs.readdirSync(target).sort((a, b) => {
        if (a === 'main.sheet') return -1;
        if (b === 'main.sheet') return 1;
        return a.localeCompare(b);
    });
    return {
        files: dir.map((file) => ({
            path: file,
            data: fs.readFileSync(`${target}/${file}`).toString()
        }))
    };
}

async function loadTemplate(id) {
    const target = path.join(templateDir, id);
    const data = fs.readFileSync(target);
    return data.toString();
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

function listTemplates() {
    return fs.readdirSync(templateDir)
        .filter(x => x.endsWith('.template'));
}



module.exports = { getWorkspace, listPresets, listExternalResources, listTemplates, loadTemplate, templateDir }