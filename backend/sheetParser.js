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

function getInfo(name, text, required) {
    const regex = new RegExp(`\s*${name}:\s*(.*)`);
    const match = text.match(regex, text);
    if (match === null && required) {
        throw new Error(`missing ${name} info`);
    }
    const info = match[1];
    if (!info) {
        throw new Error(`missing ${name} info`);   
    }
    return info.trim();
}

function getMetaData(sheetFile) {
    const text = fs.readFileSync(sheetFile).toString();
    const commentSection = getHeaderCommentSection(text);
    const tags = Array.from(commentSection.matchAll(/#(.+?)(\s|$)/g)).map(x => x[1]);
    const title = getInfo('TITLE', commentSection, true);
    const by = getInfo('BY', commentSection, true).split(',').map(x => x.trim());
    return {
        header: commentSection,
        tags,
        title,
        by 
    };
}

module.exports = { getMetaData }