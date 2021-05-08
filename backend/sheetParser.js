const fs = require("fs");
const path = require('path');
const _ = require('lodash');

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
    const lines = text.split('\n');
    const resultLines = [];
    let takeNext = false;
    for (const line of lines) {
        if (takeNext) {
            takeNext = false;
            resultLines.push(line);
        }
        const regex = new RegExp(`\s*${name}:\s*(.*)`);
        const match = line.match(regex, text);
        if (match === null) {
           continue;
        }
        let info = match[1].trim();
        if (_.last(info) === '\\') {
            info = _.dropRight(info, 1).join('');
            takeNext = true;
        }
        resultLines.push(info);
    }
    if(resultLines.length === 0 && required) {
        throw new Error(`missing ${name} info`);
    }
    return resultLines.join('\n');
}


function getMetaDataFromText(sheetFileText, required = false) {
    const commentSection = getHeaderCommentSection(sheetFileText);
    const tags = Array.from(commentSection.matchAll(/#(.{2,}?)(\s|$)/g)).map(x => x[1]);
    const links = Array.from(commentSection.matchAll(/\[\s*(.+?)\s*\]\(\s*(.+?)\s*\)/g)).map(x => ({title: x[1], url: x[2]}));
    const title = getInfo('TITLE', commentSection, required);
    const by = getInfo('BY', commentSection, required).split(',').map(x => x.trim());
    const description = getInfo('DESCRIPTION', commentSection, false);
    const creatorid = getInfo('CREATORID', commentSection, false);
    return {
        header: commentSection,
        tags,
        title,
        by,
        links,
        description,
        creatorid
    };
}

function getMetaData(sheetFile) {
    const text = fs.readFileSync(sheetFile).toString();
    return getMetaDataFromText(text, true);
}

module.exports = { getMetaData, getMetaDataFromText }