import { ViewContainerRef } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd/notification";

export interface IEditorElement extends HTMLElement {
    setScriptText(text: string);
    clearHistory();
    getScriptText(): string;
    isClean(): boolean;
    markClean();
    update();
    setFilename(name: string);
}

export enum PlayerState {
    Stopped,
    Preparing,
    Playing
};

export interface IWorkspaceElement extends HTMLElement {
    registerEditor(editor: Element);
    unregisterEditor(editor: Element);
    isClean(): boolean;
    markClean();
    play(): Promise<void>;
    stop(): Promise<void>;
    getPlayerImpl(): any;
    onError: (error) => void;
    onCompiled: (document) => void;
    onStateChanged: (old: PlayerState, new_: PlayerState) => void;
    beginQuarters: number;
    addFile(path: string, data: string): Promise<void>;
    removeFile(path: string): Promise<void>;
}

export interface ICompilerError {
    sourceId: number;
    positionBegin: number;
    sourceFile: string;
    errorMessage: string;
}

export abstract class AWorkspacePlayerComponent {
    public playerState: PlayerState = PlayerState.Stopped;
    private _playerPrepareProgressPercent: number | null = null;
    protected initialProgressPercent = 5;
    public abstract workspaceEl: ViewContainerRef;

    public get isPlaying(): boolean {
        return this.playerState !== PlayerState.Stopped;
    }

    constructor(protected notification: NzNotificationService) {

    }
    public get playerPrepareProgressPercent(): number {
        if (this._playerPrepareProgressPercent === null) {
            return null;
        }
        return Math.max(this.initialProgressPercent, this._playerPrepareProgressPercent);
    }

    get workspaceComponent(): IWorkspaceElement | null {
        if (!this.workspaceEl) {
            return null;
        }
        return this.workspaceEl.element.nativeElement as IWorkspaceElement;
    }

    protected onCompilerError(error: ICompilerError) {}
    protected onWerckCompiled(document: any) {}
    protected onPlayerStateChanged(old: PlayerState, new_: PlayerState) {
        if (old == new_) {
            return;
        }
        if (new_ === PlayerState.Preparing) {
            this._playerPrepareProgressPercent = this.initialProgressPercent;
        }
        if (new_ === PlayerState.Playing) {
            this._playerPrepareProgressPercent = null;
        }
        if (new_ === PlayerState.Stopped) {
            this._playerPrepareProgressPercent = null;
        }
        this.playerState = new_;
    }

    protected initWorkspace() {
        this.workspaceComponent.onError = this.onCompilerError.bind(this);
        this.workspaceComponent.onCompiled = this.onWerckCompiled.bind(this);
        this.workspaceComponent.onStateChanged = this.onPlayerStateChanged.bind(this);
        let numberOfTasks = 0;
        this.workspaceComponent.getPlayerImpl().playerTaskVisitor = {
            newTasks: (tasks) => {
                numberOfTasks = tasks.length;
                this._playerPrepareProgressPercent = 0;
            },
            done: (task) => {
                const progress = 100 / (numberOfTasks || 1);
                this._playerPrepareProgressPercent += progress;
            },
            message: (text: string, title?: string) => {
                this.notification.info(title || "", text)
            }
        };
    }

}