'use strict';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
export async function setVersion() {
    const configPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, 'sfdx-project.json');
    const configData = JSON.parse(fs.readFileSync(configPath).toString());
    process.env.APXR_API_VERSION = configData.sourceApiVersion;;
}