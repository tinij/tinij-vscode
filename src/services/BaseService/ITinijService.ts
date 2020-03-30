export interface ITinijService {
    onIDEEvent(file: string, isWrite: boolean, project: string | null, lineNo: number | undefined) : void;
    dispose():void;
}
