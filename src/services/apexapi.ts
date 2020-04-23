'use strict';
import fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as xml2js from 'xml2js';
import { parseEnvelope } from '../parsers';
import { Channel } from './channel';
export class ApexApi {
    private static source() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            return editor.document.getText(editor.selection);
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
        }).then((res) => res.text()).then((response) => {
            this.parse(response);
        });
    }
    private static parse(xml: string) {
        const stripNS = xml2js.processors.stripPrefix;
        const parseOptions = {
            emptyTag: null,
            explicitArray: false,
            ignoreAttrs: true,
            normalizeTags: false,
            tagNameProcessors: [stripNS]
        };
        xml2js.parseString(xml, parseOptions, function(err, result) {
            //const env = result.Envelope;
            const message = parseEnvelope(result.Envelope);
            let channel = Channel.getInstance();
            channel.writeLog(message);
            channel.showLog();
        });
    }
}