export interface ITinijService {
    initService() : Promise<boolean>;
    onIDEEvent(file: string, isWrite: boolean, project: string | null, lineNo: number | undefined) : void;
    dispose():void;
}
