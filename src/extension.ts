"use strict";
import * as vscode from 'vscode';
import { ProgressLocation, window } from 'vscode';
import { executeAnonymous } from "./services/apexApi";
const auth = require("./services/authenticate");

export function activate(context: vscode.ExtensionContext) {
    auth.setAuthInfo();
    auth.watchDefaultOrg();
    //auth.showTokenRefresh();

    const apxrExecuteAnonymous = vscode.commands.registerCommand('apexrunner.executeAnonymous', () => {
        window.withProgress({
            location: ProgressLocation.Notification,
            title: "Executing Code...",
            cancellable: true
        }, async () => {
            return await executeAnonymous();
        });
    });
    const apxrRefreshToken = vscode.commands.registerCommand('apexrunner.refreshToken', () => {
        window.withProgress({
            location: ProgressLocation.Notification,
            title: "Refreshing Access Token...",
            cancellable: false
        }, async () => {
            return await auth.setAuthInfo();
        });
    });
    context.subscriptions.push(apxrExecuteAnonymous);
    context.subscriptions.push(apxrRefreshToken);
}
export function deactivate(context: vscode.ExtensionContext) {
    context.subscriptions.forEach(element => {
        element.dispose();
    });
}
