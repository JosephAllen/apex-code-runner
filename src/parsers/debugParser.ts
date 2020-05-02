'use strict';
import * as vscode from 'vscode';
import { hideTokenRefresh } from '../services';
export function parseEnvelope(envelope: any) {
    let userDebug = '';
    if (envelope.Body.hasOwnProperty('Fault')) {
        userDebug = 'FATAL_ERROR\n' + envelope.Body.Fault.faultstring;
        if (userDebug.includes('INVALID_SESSION_ID')) {
            vscode.commands.executeCommand('setContext', 'APXRActive', false);
            hideTokenRefresh();
            userDebug += '\n\nExecute `sfdx force:org:open` from the terminal and reload your project';
        }
        return userDebug;
    }
    const result = envelope.Body.executeAnonymousResponse.result;
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