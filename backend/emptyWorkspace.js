const fs = require("fs");
const workspaceDir = './defaultWorkspace';
let EmptyWorkspace = null;


function loadWorkspaceFiles() {
    const dir = fs.readdirSync(workspaceDir).sort((a, b) => {
        if (a === 'main.sheet') return -1;
        if (b === 'main.sheet') return 1;
        return a.localeCompare(b);
    });
    return {
        files: dir.map(file => ({
            path: file,
            data: fs.readFileSync(`${workspaceDir}/${file}`).toString()
        }))
    };
}

function GetEmptyWorkspace() {
    if (!EmptyWorkspace) {
        EmptyWorkspace = loadWorkspaceFiles();
    }
    return EmptyWorkspace;
}

module.exports = GetEmptyWorkspace;