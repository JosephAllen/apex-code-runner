'use strict';
import * as vscode from 'vscode';
export const USER_DEBUG_CHANNEL = vscode.window.createOutputChannel('Apex: User Debug');
export const DEBUG_LOG_CHANNEL = vscode.window.createOutputChannel('Apex: Debug Log');
export class Channel {
    private readonly userDebugChannel: vscode.OutputChannel;
    private readonly debugLogChannel: vscode.OutputChannel;
    private static instance: Channel;
    constructor(channel?: vscode.OutputChannel) {
        this.userDebugChannel = channel || USER_DEBUG_CHANNEL;
        this.debugLogChannel = channel || DEBUG_LOG_CHANNEL;
    }
    public static getInstance(channel?: vscode.OutputChannel) {
        if (!Channel.instance) {
            Channel.instance = new Channel(channel);
        }
        return Channel.instance;
    }
    public writeUserLog(data: string) {
        //const stringData = data;
        this.userDebugChannel.clear();
        this.userDebugChannel.appendLine(data);
    }
    public writeDebugLog(data: string) {
        this.debugLogChannel.clear();
        this.debugLogChannel.appendLine(data);
    }
    public showLog() {
        const config = vscode.workspace.getConfiguration('apex-code-runner');
        if (config.preferredWindow !== 'userDebug') {
            this.debugLogChannel.show(true);
        }
        else {
            this.userDebugChannel.show(true);
        }
    }
}