export interface IExtentionIDEService {
    initialize() : void;
    promptApiKey(): void;
    promptDebug(): void;
    promptStatusBar(): void;
    promptStatusBarActivity(): void;
    openWebsite(): void;
    openLogFile(): void;

    dispose():void;
}
