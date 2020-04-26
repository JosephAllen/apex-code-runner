"use strict";
import * as vscode from "vscode";
import { executeAnonymous } from "./services/apexApi";
const auth = require("./services/authenticate");

export function activate(context: vscode.ExtensionContext) {
    auth.setAuthInfo();

    const apxrExecuteAnonymous = vscode.commands.registerCommand(
        "apexrunner.executeAnonymous",
        executeAnonymous
    );

    context.subscriptions.push(apxrExecuteAnonymous);
}
export function deactivate() { }
