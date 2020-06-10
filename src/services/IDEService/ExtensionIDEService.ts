import * as vscode from "vscode";
import {ITinijService} from "../BaseService/ITinijService";
import {IExtentionIDEService} from "./IExtentionIDEService";
import { IHelperExtensions } from "../BaseService/IHelperExtensions";

export class ExtensionIDEService implements IExtentionIDEService {

    public tinijService: ITinijService;
    public helperService: IHelperExtensions;

    private hasApiToken: boolean;
    private disposable: vscode.Disposable | undefined;

    constructor(tinijService: ITinijService, helperService: IHelperExtensions)
    {
        this.tinijService = tinijService;
        this.helperService = helperService;
        this.hasApiToken = false;
    }

    dispose(): void {
    }

    promptApiKey(): void {
        let promptOptions = {
            prompt: 'Tinij Api Key',
            placeHolder: 'Enter your api key from https://app.tinij.com/account',
            ignoreFocusOut: true,
        };
        vscode.window.showInputBox(promptOptions).then(val => {
            if (val !== null && val !== undefined) {
                this.tinijService.setApiToken(val);
            } else {
                vscode.window.setStatusBarMessage('WakaTime api key not provided');
            }
        });
    }

    promptDebug(): void {
    }

    promptStatusBar(): void {
    }

    promptStatusBarActivity(): void {
    }

    openWebsite(): void {
        let url = 'https://app.tinij.com/';
        vscode.env.openExternal(vscode.Uri.parse(url));
    }

    openLogFile(): void {
        let path = this.tinijService.getActivityFile();
        if (path) {
            let uri = vscode.Uri.file(path);
            vscode.window.showTextDocument(uri);
        }
    }


    resetToDefault(): Promise<boolean> {
        return this.tinijService.resetToDefault();
    }

    clearCacheData(): Promise<boolean> {
        return this.tinijService.clearCache();
    }


    public async initialize() : Promise<void> {
        this.setupEventListeners();
        this.hasApiToken = await this.tinijService.apiTokenExist();
        this.checkAndPromtApiKey();
    }

    private setupEventListeners(): void {
        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscriptions);
        // create a combined disposable from both event subscriptions
        this.disposable = vscode.Disposable.from(...subscriptions);
    }

    private onChange(): void {
        this.onEvent(false);
    }

    private onSave(): void {
        this.onEvent(true);
    }

    private checkAndPromtApiKey() : void {
        if (this.hasApiToken === false) {
            this.promptApiKey();
        }
    }

    private onEvent(isWrite: boolean): void {
        let editor = vscode.window.activeTextEditor;
        let doc = editor?.document;
        let file: string | undefined = doc?.fileName;
        if (!file) {
            return;
        }
        this.tinijService.onIDEEvent(file, isWrite, this.helperService.getProjectName(file),0);
    }


}
