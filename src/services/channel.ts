'use strict';
import * as vscode from 'vscode';
export const USER_DEBUG_CHANNEL = vscode.window.createOutputChannel('Apex: User Debug');
export class Channel {
    private readonly userDebugChannel: vscode.OutputChannel;
    private static instance: Channel;
    constructor(channel ? : vscode.OutputChannel) {
        this.userDebugChannel = channel || USER_DEBUG_CHANNEL;
    }
    public static getInstance(channel ? : vscode.OutputChannel) {
        if (!Channel.instance) {
            Channel.instance = new Channel(channel);
        }
        return Channel.instance;
    }
    public writeLog(data: string) {
        const stringData = data;
        this.userDebugChannel.clear();
        this.userDebugChannel.appendLine(stringData);
    }
    public showLog() {
        this.userDebugChannel.show(true);
    }
}