'use strict';
import * as vscode from 'vscode';
import * as auth from './services/authenticate';
import { ApexApi } from './services/apexapi';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    auth.setAuthInfo();
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Apex Runner Extension is Activated');
    const executeAnonymous = vscode.commands.registerCommand('apexrunner.executeAnonymous', () => {
        //const msg = vscode.window.showInformationMessage('Executing Code', 'Cancel');
        ApexApi.executeAnonymous();
    });
    context.subscriptions.push(executeAnonymous);
}
// this method is called when your extension is deactivated
export function deactivate() {}