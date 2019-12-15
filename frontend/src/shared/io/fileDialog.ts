import * as $ from 'jquery';
import { BackendService } from 'src/app/services/backend.service';
import { AppConfig } from 'src/config';
import { ExtensionMap, FileType } from './file';


export class FileDialogOptions {
    filetypes: FileType[];
    title: string;
}