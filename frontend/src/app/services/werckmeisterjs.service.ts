import { Injectable } from '@angular/core';
import { ARestService } from './arest.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

interface WerckmeisterModule {
  cwrap: (name: string, returnType: string, args: any[]) => CallableFunction;
  _free: (ptr:number) => void;
  UTF8ToString: (strPtr:number) => string;
  FS: {
    writeFile: (path: string, data: string) => void,
    analyzePath: (path: string, dontResolveLastLink: boolean) => {
      isRoot: boolean,
      exists: boolean,
      error: Error,
      name: string,
      path: string,
      object: string,
      parentExists: boolean,
      parentPath: string,
      parentObject: string
    },
    mkdir: (path: string) => void
  };
}

// http://localhost:4200/werckmeister-auxiliaries.json
declare const startWerckmeisterJs: () => Promise<WerckmeisterModule>;

export interface IRequestFile {
  path: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class WerckmeisterjsService extends ARestService {
  protected endpointUrl: string = "";
  private _auxiliaries: Promise<any[]>;
  private _werckmeisterModule: Promise<WerckmeisterModule>;
  private createCompileResult: (file: string) => number;
  get werckmeisterModule() : Promise<WerckmeisterModule> {
    if (!this._werckmeisterModule) {
      this._werckmeisterModule = startWerckmeisterJs()
        .then(async (werckmeisterModule) => {
          this.prepareModule(werckmeisterModule);
          await this.prepareFileSystem(werckmeisterModule);
          return werckmeisterModule;
        });
    }
    return this._werckmeisterModule;
  }

  get auxiliaries(): Promise<any[]> {
    if (!this._auxiliaries) {
      this._auxiliaries = this.get("werckmeister-auxiliaries.json");
    }
    return this._auxiliaries;
  }

  constructor(httpClient: HttpClient) {
    super(httpClient)
  }

  private prepareModule(werckmeisterModule: WerckmeisterModule) {
    this.createCompileResult = 
      werckmeisterModule.cwrap('create_compile_result', 'number', ['string']) as (file: string) => number;
  }

  /**
   * like mkdir -p
   * @param file 
   */
  private mkdir_p(path: string, werckmeisterModule: WerckmeisterModule) {
    const segs = path.split('/');
    const createdSegs:string[] = [];
    for (let idx = 0; idx < segs.length; ++idx) {
      if (idx === segs.length - 1) {
        // skip filename
        break;
      }
      const seg = segs[idx];
      createdSegs.push(seg);
      const dirpath = createdSegs.join('/');
      const stat = werckmeisterModule.FS.analyzePath(dirpath, false);
      if (stat.exists) {
        continue;
      }
      werckmeisterModule.FS.mkdir(dirpath);
    }
  }

  private async prepareFileSystem(werckmeisterModule: WerckmeisterModule) {
    const auxFiles:IRequestFile[] = _.cloneDeep(await this.auxiliaries);
    const fs = werckmeisterModule.FS;
    for (const file of auxFiles) {
      try {
        this.mkdir_p(file.path, werckmeisterModule);
        fs.writeFile(file.path, file.data);
      } catch(ex) {
        console.error(ex);
      }
    }
  }

  async compile(sheetFile: IRequestFile) {
    const wm =  await this.werckmeisterModule;
    let strPtr: number = 0;
    try {
      wm.FS.writeFile(sheetFile.path, sheetFile.data);
      strPtr = this.createCompileResult(sheetFile.path);
    } catch(ex) {
      console.error(ex)
    }
    const resultStr = wm.UTF8ToString(strPtr);
    wm._free(strPtr);
    const resultJson = JSON.parse(resultStr);
    if (resultJson.errorMessage) {
      throw {error: resultJson};
    }
    return resultJson;
  }
}
