import { Router } from '@angular/router';
import { AppConfig } from 'src/config';
import * as _ from 'lodash';
import { TutorialToc, TutorialTocUrl } from '../../partials/help/toc/toc.component';
import { WerckService } from 'src/app/services/werck.service';
import { IFile } from 'src/shared/io/file';


const RouteMidiConfig = '/help/tutorial/selectmidi';

let routeToContinue: string;

export abstract class ATutorial {

    onSnippetsAreReady: ()=>void;
    constructor(public route: Router, public werck: WerckService) {
        this.onSnippetsAreReady = _.debounce(this.onSnippetsAreReadyImpl.bind(this), 100);
    }
    

    private onSnippetsAreReadyImpl() {
        this.redirectToMidiConfigIfNeccessary();
    }

    abstract files: IFile[];

    async goto(url:string) {
        await this.werck.closeSheet();
        this.route.navigateByUrl(url);
    }

    private get location(): string {
        return this.route.url;
    }

    get hasMidiPort(): boolean {
        return AppConfig.Tutorial.defaultMidiPort !== undefined;
    }

    redirectToMidiConfigIfNeccessary() {
        if (this.location === RouteMidiConfig) {
            return;
        }
        if (!this.hasMidiPort) {
            routeToContinue = this.location;
            this.goto(RouteMidiConfig);
        }
    }

    private get nextUrl(): string {
        let loc = this.location;
        let idx = _(TutorialToc).findIndex(x => x.route === loc);
        if (idx === -1) {
            return null;
        }
        idx += 1;
        if (idx >= TutorialToc.length) {
            return null;
        }
        return TutorialToc[idx].route;
    }

    private get prevUrl(): string {
        let loc = this.location;
        let idx = _(TutorialToc).findIndex(x => x.route === loc);
        if (idx === -1) {
            return null;
        }
        idx -= 1;
        if (idx < 0) {
            return null;
        }
        return TutorialToc[idx].route;
    }

    next(ev: MouseEvent) {
        ev.preventDefault();
        this.goto(this.nextUrl);
    }

    prev(ev: MouseEvent) {
        ev.preventDefault();
        this.goto(this.prevUrl);
    }

    continue(ev: MouseEvent) {
        if (!routeToContinue) {
            this.toc(ev);
            return;
        }
        ev.preventDefault();
        let route = routeToContinue;
        routeToContinue = null;
        this.goto(route);
    }

    get hasNext(): boolean {
        return this.nextUrl !== null;
    }

    get hasPrev(): boolean {
        return this.prevUrl !== null;
    }

    toc(ev: MouseEvent) {
        ev.preventDefault();
        this.goto(TutorialTocUrl);
    }

    prepareSnippet(text: string, fallbackPort:number = 0): string {
        let port = AppConfig.Tutorial.defaultMidiPort;
        if (port === undefined) {
            port = fallbackPort;
        }
        return text.replace(/\$PORTNR/g, port.toString());
    }

    onSnippetIsReady() {
        this.onSnippetsAreReady();
    }
}