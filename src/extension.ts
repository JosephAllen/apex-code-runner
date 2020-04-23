'use strict';
import * as vscode from 'vscode';
import { executeAnonymous } from './services/apexApi';
import * as apiVersion from './services/apiVersion';
import * as auth from './services/authenticate';
export function activate(context: vscode.ExtensionContext) {
    auth.setAuthInfo();
    apiVersion.setVersion();
    console.log('Apex Runner Extension is Activated');
    const apxrExecuteAnonymous = vscode.commands.registerCommand('apexrunner.executeAnonymous', executeAnonymous);
    context.subscriptions.push(apxrExecuteAnonymous);
}
export function deactivate() {}