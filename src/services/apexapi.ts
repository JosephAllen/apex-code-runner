'use strict';
import { Channel } from './channel';
import * as xml2js from 'xml2js';
import * as vscode from 'vscode';
import fetch from 'node-fetch';
export class ApexApi {
    private static source() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            return document.getText(selection);
        }
    }
    public static async executeAnonymous(): Promise < void > {
        const authInfo = JSON.parse('' + process.env.APXR_AUTH_INFO);
        const accessToken = authInfo.accessToken;
        const instanceUrl = authInfo.instanceUrl;
        let env = {
            'soap:Envelope': {
                $: {
                    "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                    "xmlns": "http://soap.sforce.com/2006/08/apex"
                },
                'soap:Header': {
                    DebuggingHeader: {
                        categories: [{
                                category: 'Apex_code',
                                level: 'Debug'
                            },
                            {
                                category: 'APEX_PROFILING',
                                level: 'Info'
                            }
                        ]
                    },
                    SessionHeader: {
                        sessionId: accessToken
                    }
                },
                'soap:Body': {
                    executeAnonymous: {
                        String: this.source()
                    }
                }
            }
        };
        let builder = new xml2js.Builder();
        let requestBody = builder.buildObject(env);
        fetch(instanceUrl + '/services/Soap/s/47.0', {
            method: 'post',
            body: requestBody,
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': '""'
            },
        }).then((res: any) => res.text()).then((response: string) => {
            this.parse(response);
        });
    }
    private static parse(xml: string) {
        var parseString = require('xml2js').parseString;
        var stripNS = require('xml2js').processors.stripPrefix;
        let parseOptions = {
            emptyTag: null,
            explicitArray: false,
            ignoreAttrs: true,
            normalizeTags: false,
            tagNameProcessors: [stripNS]
        };
        parseString(xml, parseOptions, function(err: any, result: any) {
            let channel = Channel.getInstance();
            var response = {};
            const env = result.Envelope;
            if (env.Body.hasOwnProperty('Fault')) {
                response = env.Body.Fault;
            }
            else {
                let message = '';
                if (env.Header.DebuggingInfo.debugLog !== null) {
                    message = env.Header.DebuggingInfo.debugLog;
                }
                else {
                    message = JSON.stringify(env.Body.executeAnonymousResponse.result, null, 2);
                }
                channel.writeLog(message);
            }
            channel.showLog();
        });
    }
}