import { Injectable } from '@angular/core';
import { ARestService } from './arest.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

interface WerckmeisterModule {
  cwrap: (name: string, returnType: string, args: any[]) => CallableFunction;
  _free: (ptr:number) => void;
  UTF8ToString: (strPtr:number) => string;
}

// http://localhost:4200/werckmeister-auxiliaries.json
declare const startWerckmeisterJs: () => Promise<WerckmeisterModule>;

@Injectable({
  providedIn: 'root'
})
export class WerckmeisterjsService extends ARestService {
  protected endpointUrl: string = "";
  private _auxiliaries: Promise<any[]>;
  private _werckmeisterModule: Promise<WerckmeisterModule>;
  get werckmeisterModule() : Promise<WerckmeisterModule> {
    if (!this._werckmeisterModule) {
      this._werckmeisterModule = startWerckmeisterJs();
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

  async compile(request: any[]) {
    const wm =  await this.werckmeisterModule;
    const requestFiles = _.cloneDeep(await this.auxiliaries);
    for(const file of request) {
      requestFiles.push(file);
    }
    const createCompileResult = wm.cwrap('create_compile_result', 'number', ['string']);
    const inputJson = JSON.stringify(requestFiles);
    const strPtr = createCompileResult(inputJson);
    const resultStr = wm.UTF8ToString(strPtr);
    wm._free(strPtr);
    const resultJson = JSON.parse(resultStr);
    console.log(resultJson);
    return resultJson;
  }
}
