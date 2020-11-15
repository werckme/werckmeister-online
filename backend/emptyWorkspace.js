const fs = require("fs");
const workspaceDir = './defaultWorkspace';
let EmptyWorkspace = null;


function loadWorkspaceFiles() {
    const dir = fs.readdirSync(workspaceDir);
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