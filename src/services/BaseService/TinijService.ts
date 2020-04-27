import * as vscode from 'vscode';
import {ITinijService} from "./ITinijService";
import { Tinij, CategoryEnum, PluginTypeEnum } from "tinij-base";
import { PLUGIN_NAME } from '../../constants';

export class TinijService implements ITinijService {

    private tinijExecutor: Tinij;
    private lastTrackedFile: string | undefined;
    private lastTrackedActivity: number = 0;

    constructor() {
        this.tinijExecutor = new Tinij();
    }

    getActivityFile(): string {
        let config = this.tinijExecutor.getConfig();
        return config.GetActivityFileLocation();
    }

    
    getConfigFile(): string {
        let config = this.tinijExecutor.getConfig();
        return config.GetConfigLocation();
    }

    async apiTokenExist(): Promise<boolean> {
        return this.tinijExecutor.isApiKeyExist();
    }
    
    setApiToken(token: string): Promise<boolean> {
        return this.tinijExecutor.setApiKey(token);
    }

    async initService(): Promise<boolean> {
        let initServiceResult = await this.tinijExecutor.initServices();
        let tinijConfig = this.tinijExecutor.getConfig();
        return initServiceResult;
    }

    public onIDEEvent(file: string, isWrite: boolean, project: string, lineNo: number | undefined): void {
        if (!file) {
            return;
        }
        let time: number = Date.now();
        if (isWrite || this.enoughTimePassed(time) || this.lastTrackedFile !== file) {
            this.sendActivityEvent(file, isWrite, project, lineNo);
            this.lastTrackedFile = file;
            this.lastTrackedActivity = time;
        }
    }

    private enoughTimePassed(time: number): boolean {
        return this.lastTrackedActivity + 120000 < time;
    }

    private sendActivityEvent(file: string, isWrite: boolean, project: string | null, lineNo: number | undefined): void {
        console.log(file,isWrite,project, lineNo);
        this.tinijExecutor.trackActivity(PluginTypeEnum.VSCODE, new Date(), file, CategoryEnum.CODING, isWrite, project ?? "", undefined, lineNo);
    }

    public dispose(): void {
    }

    clearCache(): Promise<boolean> {
        return this.tinijExecutor.clearRecordedLogs();
    }

    resetToDefault(): Promise<boolean> {
        return this.tinijExecutor.resetSettingsToDefault();
    }
}
