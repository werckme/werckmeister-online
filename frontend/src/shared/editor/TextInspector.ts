import { IEditor } from './IEditor';
import { AInspector } from './AInspector';

export class TextInspector extends AInspector {
    constructor(editor: IEditor) {
        super(editor);
    }
}