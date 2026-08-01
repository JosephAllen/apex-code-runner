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

        //Call org display for the non-secret connection info (instance url, api version)
        const stdout = require('child_process').execSync(`sf org display --json --target-org \"${defUserName}\"`).toString();
        const displayResult = JSON.parse(stdout);

        //Fetch the access token via the dedicated command.
        //Recent Salesforce CLI versions mask secrets in `sf org display` output,
        //so its accessToken is now a placeholder message rather than a real session id.
        const tokenStdout = require('child_process').execSync(`sf org auth show-access-token --json --no-prompt --target-org \"${defUserName}\"`).toString();
        const tokenResult = JSON.parse(tokenStdout);

        let authInfo = {
            accessToken: tokenResult.result.accessToken,
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
