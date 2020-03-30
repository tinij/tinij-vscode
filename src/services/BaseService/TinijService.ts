import * as vscode from 'vscode';
import {ITinijService} from "./ITinijService";
import { Tinij } from 'tinij-base';
import { PLUGIN_NAME } from '../../constants';
import { CategoryEnum } from 'tinij-base/dist/enums/CategoryEnum';

export class TinijService implements ITinijService {

    tinijExecutor: Tinij;

    constructor() {
        this.tinijExecutor = new Tinij("test");
    }

    private lastTrackedFile: string | undefined;
    private lastTrackedActivity: number = 0;

    public onIDEEvent(file: string, isWrite: boolean, project: string, lineNo: number | undefined): void {
        if (!file)
            return;
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
        this.tinijExecutor.trackActivity(PLUGIN_NAME, Math.floor(Date.now() / 1000), file, CategoryEnum.CODING, isWrite, project ?? undefined, undefined, lineNo);
    }

    public dispose(): void {
    }
}
