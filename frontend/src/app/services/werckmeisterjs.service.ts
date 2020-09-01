import { Injectable } from '@angular/core';


interface WerckmeisterModule {
  cwrap: (name: string, returnType: string, args: any[]) => CallableFunction;
  _free: (ptr:number) => void;
  UTF8ToString: (strPtr:number) => string;
}

declare const startWerckmeisterJs: () => Promise<WerckmeisterModule>;

@Injectable({
  providedIn: 'root'
})
export class WerckmeisterjsService {

  private _werckmeisterModule: Promise<WerckmeisterModule>;
  get werckmeisterModule() : Promise<WerckmeisterModule> {
    if (!this._werckmeisterModule) {
      this._werckmeisterModule = startWerckmeisterJs();
    }
    return this._werckmeisterModule;
  } 

  constructor() { 
  }

  async compile(request: any) {
    const wm = await this.werckmeisterModule;
    const createCompileResult = wm.cwrap('create_compile_result', 'number', ['string']);
    const inputJson = JSON.stringify(request);
    const strPtr = createCompileResult(inputJson);
    const resultStr = wm.UTF8ToString(strPtr);
    console.log(resultStr);
    wm._free(strPtr);
    const resultJson = JSON.parse(resultStr);
    return resultJson;
  }
}
