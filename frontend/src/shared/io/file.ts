import { DocumentSourceId, Path } from '../werck/types';
import { sha256, sha224 } from 'js-sha256';
import { AppConfig } from 'src/config';
import { TextFileContent } from './fileContent';

export enum FileType {
    All = "All",
    Sheet = "Sheet",
    Template = "Template",
    Pitchmap = "Pitchmap",
    Chords = "Chords",
    Lua = "Lua",
    Midi = "Midi"
}

export const ExtensionMap = {
    Sheet: AppConfig.knownExtensions.sheet,
    Template: AppConfig.knownExtensions.template,
    Pitchmap: AppConfig.knownExtensions.pitchmap,
    Chords: AppConfig.knownExtensions.chordDef,
    Midi: AppConfig.knownExtensions.midi
}

export function getFileTypeForExtension(ext: string): FileType {
    for (let key in ExtensionMap) {
        if (ext === ExtensionMap[key]) {
            return key as FileType;
        }
    }
    return undefined;
}

export const UndefinedSourceId: DocumentSourceId = null;

export interface IFileContent {
    changed: boolean;
}

export interface ITextFileContent extends IFileContent {
    data: string;
}

export interface IBinaryFileContent extends IFileContent {
    data: Uint8Array;
}

export interface IFile {
    path: Path;
    filename: string;
    extension: string;
    content: IFileContent;
    sourceId: DocumentSourceId;
    equals(b: IFile);
    hasContent: boolean;
    isNew: boolean;
}

export interface ISheetFile extends IFile {
    error: string;
    warnings: string[];
    hasError: boolean;
    hasWarnings: boolean;
}


export class AFile implements IFile {
    path: string;
    content: IFileContent;
    filename: string;
    extension: string;
    sourceId: DocumentSourceId;
    get isNew(): boolean {
        return this.sourceId === UndefinedSourceId;
    }
    get hasContent(): boolean {
        return !!this.content;
    }
    equals(b: IFile) {
        if (!b) {
            return false;
        }
        return this.sourceId === b.sourceId;
    }
    protected assign(copyFrom: IFile) {
        this.path = copyFrom.path;
        this.content = copyFrom.content;
        this.filename = copyFrom.filename;
        this.extension = copyFrom.extension;
        this.sourceId = copyFrom.sourceId;
    }
    
    constructor(copyFrom: IFile = null) {
        if (!!copyFrom) {
            this.assign(copyFrom);
        }
    }
}

export function getFilename(path: Path) {
    return path.replace(/^.*(\\|\/|\:)/, '');
}

export function getExtension(path: Path) {
    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(path)[1];
    if (!ext) {
        return undefined;
    }
    return '.' + ext;

}

export function getHash(content: string) {
    let hash = sha256.create();
    hash.update(content);
    return hash.hex();
}

export function getByteHash(content: Uint8Array) {
    let hash = sha256.create();
    hash.update(content);
    return hash.hex();
}

export function strToArrayBuffer(str: string): Uint8Array {
    // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}