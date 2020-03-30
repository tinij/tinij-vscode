import * as vscode from "vscode";
import {ITinijService} from "../BaseService/ITinijService";
import {IExtentionIDEService} from "./IExtentionIDEService";
import { IHelperExtensions } from "../BaseService/IHelperExtensions";

export class ExtensionIDEService implements IExtentionIDEService {

    public tinijService: ITinijService;
    public helperService: IHelperExtensions;

    private disposable: vscode.Disposable | undefined;

    constructor(tinijService: ITinijService, helperService: IHelperExtensions)
    {
        this.tinijService = tinijService;
        this.helperService = helperService;
    }

    dispose(): void {
    }


    promptApiKey(): void {
    }

    promptDebug(): void {
    }

    promptStatusBar(): void {
    }

    promptStatusBarActivity(): void {
    }

    openWebsite(): void {
    }

    openLogFile(): void {
    }


    public initialize() : void {
        this.setupEventListeners();
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
