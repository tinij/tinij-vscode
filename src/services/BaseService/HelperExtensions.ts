import { IHelperExtensions } from "./IHelperExtensions";
import * as vscode from 'vscode';

export class HelperExtensions implements IHelperExtensions {

    getProjectName(file: string): string | null {
        let uri = vscode.Uri.file(file);
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (vscode.workspace && workspaceFolder) {
            try {
                return workspaceFolder?.name;
            } catch (e) {
                //ignore error;
            }
        }
        return null;
    }

    formatDate(date: Date): string {
        throw new Error("Method not implemented.");
    }
    getUserAgent(): string {
        throw new Error("Method not implemented.");
    }

}