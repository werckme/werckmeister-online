import * as $ from 'jquery';
import { BackendService } from 'src/app/services/backend.service';
import { AppConfig } from 'src/config';
import { ExtensionMap, FileType } from './file';


export class FileDialogOptions {
    filetypes: FileType[];
    title: string;
}

export class OpenFileDialog {
    constructor(protected backend: BackendService) {}
    show(options: FileDialogOptions = null): Promise<string> {
        if (options === null) {
            options = new FileDialogOptions();
            options.title = "Find File";
            options.filetypes = [FileType.All];
        }
        return this.backend.appShowOpenFileDialog(options);
        // not supported on linux: 
        // return new Promise(resolve => {
        //     let dummyInput = $("<input type='file'>");
        //     dummyInput.change((el, val) => {
        //         console.log(dummyInput.val());
        //         resolve(el);
        //     });
        //     dummyInput.click();
        // });
    }
}

export class SaveFileDialog {
    constructor(protected backend: BackendService) {}
    show(options: FileDialogOptions = null): Promise<string> {
        if (options === null) {
            options = new FileDialogOptions();
            options.title = "Find File";
            options.filetypes = [FileType.All];
        }
        return this.backend.appShowSaveFileDialog(options);
    }
}
