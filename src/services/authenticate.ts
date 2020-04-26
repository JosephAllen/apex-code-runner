'use strict';
import * as vscode from 'vscode';
const sfdxCoreExports = vscode.extensions.getExtension('salesforce.salesforcedx-vscode-core')!.exports;
export async function setAuthInfo() {

    const orgAuthInfo = await sfdxCoreExports.OrgAuthInfo;
    const defUserName = await orgAuthInfo.getDefaultDevHubUsernameOrAlias();
    const auth = await orgAuthInfo.getConnection(defUserName);
    process.env.APXR_AUTH_INFO = JSON.stringify(
        {
            accessToken: auth.accessToken,
            instanceUrl: auth.instanceUrl,
            version: auth.version
        }
    );
    vscode.commands.executeCommand('setContext', 'APXRActive', true);
}