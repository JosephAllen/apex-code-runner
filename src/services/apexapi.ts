"use strict";
import fetch from "node-fetch";
import * as vscode from "vscode";
import * as xml2js from "xml2js";
import { parseEnvelope } from "../parsers";
import { Channel } from "./channel";

function source() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    return editor.document.getText();
  }
  return "";
}

export async function executeAnonymous(): Promise<void> {
  //TODO: see https://github.com/microsoft/vscode-extension-samples/tree/master/progress-sample for progress
  const authInfo = JSON.parse("" + process.env.APXR_AUTH_INFO);
  const accessToken = authInfo.accessToken;
  const instanceUrl = authInfo.instanceUrl;
  //const categories = getCategories();
  let env = {
    "soap:Envelope": {
      $: {
        "xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
        xmlns: "http://soap.sforce.com/2006/08/apex",
      },
      "soap:Header": {
        DebuggingHeader: {
          categories: getCategories(),
        },
        SessionHeader: {
          sessionId: accessToken,
        },
      },
      "soap:Body": {
        executeAnonymous: {
          String: source(),
        },
      },
    },
  };
  let builder = new xml2js.Builder();
  let requestBody = builder.buildObject(env);
  fetch(instanceUrl + "/services/Soap/s/" + process.env.APXR_API_VERSION, {
    method: "post",
    body: requestBody,
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      SOAPAction: '""',
    },
  })
    .then((res) => res.text())
    .then((response) => {
      parseXml(response);
    });
}

function getCategories() {
  let categories = [];
  const configOptions = vscode.workspace.getConfiguration("apex-code-runner")
    .logCategoryOptions;
  for (const [key, value] of Object.entries(configOptions)) {
    categories.push({ category: key, level: value });
  }
  return categories;
}

function parseXml(xml: string) {
  const stripNS = xml2js.processors.stripPrefix;
  const parseOptions = {
    emptyTag: null,
    explicitArray: false,
    ignoreAttrs: true,
    normalizeTags: false,
    tagNameProcessors: [stripNS],
  };
  xml2js.parseString(xml, parseOptions, function(err, result) {
    const env = Object.assign({}, result.Envelope);
    const message = parseEnvelope(env);
    let channel = Channel.getInstance();
    channel.writeUserLog(message);
    if (env.Header.DebuggingInfo.debugLog !== null) {
      channel.writeDebugLog("DEBUG LOG\n" + env.Header.DebuggingInfo.debugLog);
    } else {
      channel.writeDebugLog(message);
    }
    channel.showLog();
  });
}
