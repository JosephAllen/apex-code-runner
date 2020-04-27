"use strict";
import * as vscode from 'vscode';
//import { ProgressLocation, window } from 'vscode';
import { executeAnonymous } from "./services/apexApi";
const auth = require("./services/authenticate");

export function activate(context: vscode.ExtensionContext) {
    auth.setAuthInfo();
    auth.watchDefaultOrg();

    const apxrExecuteAnonymous = vscode.commands.registerCommand('apexrunner.executeAnonymous', () => {
        executeAnonymous();
        // window.withProgress({
        //     location: ProgressLocation.Notification,
        //     title: "Executing Code...",
        //     cancellable: true
        // }, async () => {
        //     await executeAnonymous();
        //     var p = new Promise(resolve => {
        //         resolve();
        //     });
        //     return p;
        // });
    });
    context.subscriptions.push(apxrExecuteAnonymous);
}
export function deactivate() { }
