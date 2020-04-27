// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { COMMAND_API_KEY, COMMAND_DASHBOARD } from './commands';
import { IExtentionIDEService } from './services/IDEService/IExtentionIDEService';
import { ITinijService } from './services/BaseService/ITinijService';
import { TinijService } from './services/BaseService/TinijService';
import { ExtensionIDEService } from './services/IDEService/ExtensionIDEService';
import { IHelperExtensions } from './services/BaseService/IHelperExtensions';
import { HelperExtensions } from './services/BaseService/HelperExtensions';

let tinijIDEExtension: IExtentionIDEService | undefined;
let tinijService: ITinijService | undefined;
let helperService: IHelperExtensions | undefined;


export async function activate(context: vscode.ExtensionContext) {

	tinijService = new TinijService();
	await tinijService.initService();
	helperService = new HelperExtensions();
	tinijIDEExtension = new ExtensionIDEService(tinijService, helperService);

	console.log('Congratulations, extension "tinij" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_API_KEY, function() {
			tinijIDEExtension?.promptApiKey();
		}),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(COMMAND_DASHBOARD, function() {
			tinijIDEExtension?.openWebsite();
		}),
	);

	context.subscriptions.push(tinijService);
	context.subscriptions.push(tinijIDEExtension);

	await tinijIDEExtension.initialize();

}


// this method is called when your extension is deactivated
export function deactivate() {

}
