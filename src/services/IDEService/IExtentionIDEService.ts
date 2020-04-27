export interface IExtentionIDEService {
    initialize() : Promise<void>;
    promptApiKey(): void;
    promptDebug(): void;
    promptStatusBar(): void;
    promptStatusBarActivity(): void;
    openWebsite(): void;
    openLogFile(): void;

    dispose():void;
}
