'use strict';
import * as vscode from 'vscode';
export class Notification {
    private outputChannel: vscode.OutputChannel;
    ///private statusBarItem: vscode.StatusBarItem;
    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Apex Runner: Results');
        //this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 6);
    }
    public writeLog(data: string) {
        const stringData = data;
        this.outputChannel.appendLine(stringData);
    }
    public showLog() {
        this.outputChannel.show(true);
    }
}