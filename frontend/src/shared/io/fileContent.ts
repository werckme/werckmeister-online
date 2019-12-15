import { getHash, ITextFileContent, IBinaryFileContent, getByteHash, AFile } from './file';

const NAH = 'NOT A HASH';

export class TextFileContent implements ITextFileContent {
    hash: string;
    data: string;
    
    get changed(): boolean {
        return getHash(this.data) !== this.hash;
    }

    set changed(val: boolean) {
        if (!val) {
            this.hash = getHash(this.data);
        }
        else {
            this.hash = NAH;
        }
    }

    constructor(data: string) {
        this.data = data;
        this.changed = false;
    }
}

export class BinaryFileContent implements IBinaryFileContent {
    hash: string;
    data: Uint8Array;
    
    get changed(): boolean {
        return getByteHash(this.data) !== this.hash;
    }

    set changed(val: boolean) {
        if (!val) {
            this.hash = getByteHash(this.data);
        }
        else {
            this.hash = NAH;
        }
    }

    constructor(data: Uint8Array) {
        this.data = data;
        this.changed = false;
    }
}

export class TextFile extends AFile {
    constructor(extension: string) {
        super();
        this.extension = extension;
    }
    get text(): string {
        if (!this.hasContent) {
            return "";
        }
        return (this.content as TextFileContent).data;
    }

    set text(text: string) {
        if (this.content) {
            (this.content as TextFileContent).data = text;
            return;
        }
        this.content = new TextFileContent(text);
    }
}