'use strict';
import * as vscode from 'vscode';
import { showTokenRefresh } from '../services';
export function parseEnvelope(envelope: any) {
    let userDebug = '';
    const body = Object.assign({}, envelope.Body);

    if (body.hasOwnProperty('Fault')) {
        userDebug = 'FATAL_ERROR\n' + body.Fault.faultstring;
        if (userDebug.includes('INVALID_SESSION_ID')) {
            vscode.commands.executeCommand('setContext', 'APXRActive', false);
            showTokenRefresh();
            userDebug += '\n\nSelect "Apex: Refresh Access Token" and try execution again.';
        }
        return userDebug;
    }
    const result = body.executeAnonymousResponse.result;
    if (result.compiled === 'true' && result.success === 'true') {
        userDebug = parseDebug(envelope.Header.DebuggingInfo.debugLog);
    }
    if (result.compiled === 'true' && result.success === 'false') {
        userDebug = 'FATAL_ERROR\n' + result.exceptionMessage + '\n' + result.exceptionStackTrace;
    }
    if (result.compiled !== 'true') {
        userDebug = 'Compile error at line ';
        userDebug += result.line + ' column ' + result.column;
        userDebug += '\n' + result.compileProblem;
    }
    if (userDebug.startsWith('\n')) {
        userDebug = userDebug.substring(1);
    }

    return userDebug;

}
export function parseDebug(debugLog: string) {
    let userDebug = '';
    if (debugLog.includes('DEBUG')) {
        let debugElements = debugLog.split('|');
        debugElements.forEach((element, index) => {
            if (element.includes('USER_DEBUG')) {
                let debugData = debugElements[index + 3];
                userDebug += '\n' + debugData.substring(0, debugData.lastIndexOf('\n'));
            }
        });
    }
    if (userDebug === '') {
        userDebug = 'Anonymous execution was successful.';
    }
    return userDebug;

}
