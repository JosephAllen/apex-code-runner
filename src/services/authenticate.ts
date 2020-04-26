'use strict';
import * as vscode from 'vscode';
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