// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { AuthInfo, Org } from '@salesforce/core';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { workspace } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	setAuthInfo();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "anonapex" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('anonapex.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from anonapex!');
	});

	context.subscriptions.push(disposable);
}
async function setAuthInfo() {
	//TODO: Use process.env.MY_VARIABLE = 'ahoy'; to set variables
	//process.env.MY_VARIABLE = 'ahoy';
	//console.log(process.env);
	const configPath = path.join(
		workspace.workspaceFolders![0].uri.fsPath,
		'.sfdx',
		'sfdx-config.json'
	);
	const configData = JSON.parse(fs.readFileSync(configPath).toString());
	const defaultusername = configData.defaultusername;
	const org = await Org.create({ aliasOrUsername: defaultusername });
	const username = org.getUsername();
	const authInfo = await AuthInfo.create({
		username: username
	});
	const accessToken = authInfo.getConnectionOptions().accessToken;
	const instanceUrl = authInfo.getConnectionOptions().instanceUrl;
	console.log(JSON.stringify({ accessToken: accessToken, instanceUrl: instanceUrl }, null, 2));
}

// this method is called when your extension is deactivated
export function deactivate() { }
