'use strict';
import * as vscode from 'vscode';
import { workspace } from 'vscode';
import * as path from 'path';
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core')!.exports;
export async function setAuthInfo() {
    try {
        const orgAuthInfo = await sfdxCoreExports.OrgAuthInfo;
        const defUserName = await orgAuthInfo.getDefaultUsernameOrAlias(false);
        const userName = await orgAuthInfo.getUsername(defUserName);
        const connection = await orgAuthInfo.getConnection(userName);
        process.env.APXR_AUTH_INFO = JSON.stringify(
            {
                accessToken: connection.accessToken,
                instanceUrl: connection.instanceUrl,
                version: connection.version
            }
        );
        vscode.commands.executeCommand('setContext', 'APXRActive', true);
    }
    catch (err) {
        console.error(err);
    }
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