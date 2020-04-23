'use strict';
import * as vscode from 'vscode';
export const RESULTS_CHANNEL = vscode.window.createOutputChannel('Apex Runner: Debug Log');
export class Channel {
    private readonly resultsChannel: vscode.OutputChannel;
    private static instance: Channel;
    constructor(channel ? : vscode.OutputChannel) {
        this.resultsChannel = channel || RESULTS_CHANNEL;
    }
    public static getInstance(channel ? : vscode.OutputChannel) {
        if (!Channel.instance) {
            Channel.instance = new Channel(channel);
        }
        return Channel.instance;
    }
    public writeLog(data: string) {
        const stringData = data;
        this.resultsChannel.clear();
        this.resultsChannel.appendLine(stringData);
    }
    public showLog() {
        this.resultsChannel.show(true);
    }
}