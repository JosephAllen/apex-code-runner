'use strict';
import { AuthInfo, Org } from '@salesforce/core';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
export async function setAuthInfo() {
    const configPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, '.sfdx', 'sfdx-config.json');
    const configData = JSON.parse(fs.readFileSync(configPath).toString());
    const defaultUsername = configData.defaultusername;
    const org = await Org.create({ aliasOrUsername: defaultUsername });
    const username = org.getUsername();
    const authInfo = await AuthInfo.create({
        username: username
    });
    const auth = authInfo.getConnectionOptions();
    process.env.APEX_RUNNER_AUTH_INFO = JSON.stringify({ accessToken: auth.accessToken, instanceUrl: auth.instanceUrl });
    console.log(process.env.APEX_RUNNER_AUTH_INFO);
}