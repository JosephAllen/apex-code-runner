'use strict';
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as path from 'path';
const sbiRefresh = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core')!.exports;
export async function setAuthInfo() {
    try {
        const orgAuthInfo = await sfdxCoreExports.OrgAuthInfo;
        const defUserName = await orgAuthInfo.getDefaultUsernameOrAlias(false);
        const userName = await orgAuthInfo.getUsername(defUserName);
        const connection = await orgAuthInfo.getConnection(userName);
        let authInfo = {
            accessToken: connection.accessToken,
            instanceUrl: connection.instanceUrl,
            version: connection.version
        };
        //Call force:org:display to get a new token
        const stdout = await require('child_process').execSync('sfdx force:org:display --json -u ' + defUserName).toString();
        const displayResult = JSON.parse(stdout);
        authInfo.accessToken = displayResult.result.accessToken;
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