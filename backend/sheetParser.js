const fs = require("fs");
const path = require('path');


function getHeaderCommentSection(text) {
    const lines = text.split('\n');
    let resultLines = [];
    let inCommentSeciton = false;
    for (const line of lines) {
        const lineIsComment = line.match(/^\s*--.*$/) !== null;
        const lineIsEmpty = line.match(/^\s*$/) !== null;
        if (!inCommentSeciton && !lineIsEmpty && !lineIsComment) {
            break;
        }
        if (!inCommentSeciton && lineIsEmpty) {
            continue;
        }
        if (!inCommentSeciton && lineIsComment) {
            inCommentSeciton = true;
        }
        if (inCommentSeciton && !lineIsComment) {
            break;
        }
        resultLines.push(line.match(/^\s*--\s*(.*$)$/)[1]);
    }
    return resultLines.join('\n');
}

function getMetaData(sheetFile) {
    const text = fs.readFileSync(sheetFile).toString();
    const commentSection = getHeaderCommentSection(text);
    const tags = Array.from(commentSection.matchAll(/(#.+?)(\s|$)/g)).map(x => x[1])
    return {
        header: commentSection,
        tags: tags
    };
}

module.exports = { getMetaData }