'use strict';
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as path from 'path';
const sbiRefresh = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
export async function setAuthInfo() {
    try {

        //config get target-org to get the default alias
        const config = require('child_process').execSync(`sf config get target-org --json`).toString();
        const configResult = JSON.parse(config);
        const defUserName = configResult.result[0].value;

        //Call org display to get a new token
        const stdout = require('child_process').execSync(`sf org display --json --target-org \"${defUserName}\"`).toString();
        const displayResult = JSON.parse(stdout);
        let authInfo = {
            accessToken: displayResult.result.accessToken,
            instanceUrl: displayResult.result.instanceUrl,
            version: displayResult.result.apiVersion
        };

        //Save the token info to an environment variable for future use
        process.env.APXR_AUTH_INFO = JSON.stringify(authInfo);
        vscode.commands.executeCommand('setContext', 'APXRActive', true);
        sbiRefresh.hide();
    }
    catch (err) {
        console.error(err);
    }
}

export async function showTokenRefresh() {
    sbiRefresh.text = `$(refresh) Refresh Token`;
    sbiRefresh.tooltip = 'Refresh Access Token';
    sbiRefresh.command = 'apexrunner.refreshToken';
    sbiRefresh.show();
}

export async function hideTokenRefresh() {
    sbiRefresh.hide();
}

export async function watchDefaultOrg() {
    let workSpaceRoot = '';
    if (vscode.workspace.workspaceFolders) {
        workSpaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;;
    }
    const CONFIG_FILE = path.join(workSpaceRoot, '.sfdx', 'sfdx-config.json')
    const watcher = workspace.createFileSystemWatcher(CONFIG_FILE);
    watcher.onDidChange(() => {
        setAuthInfo();
    });
}
