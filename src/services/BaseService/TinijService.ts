import * as vscode from 'vscode';
import {ITinijService} from "./ITinijService";
import { Tinij } from 'tinij-base';
import { PLUGIN_NAME } from '../../constants';
import { CategoryEnum } from 'tinij-base/dist/enums/CategoryEnum';
import { PluginTypeEnum } from 'tinij-base/dist/enums/PluginTypeEnum';

export class TinijService implements ITinijService {

    private tinijExecutor: Tinij;
    private lastTrackedFile: string | undefined;
    private lastTrackedActivity: number = 0;

    constructor() {
        this.tinijExecutor = new Tinij("test");
    }

    initService(): Promise<boolean> {
        return this.tinijExecutor.initServices();
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
}
