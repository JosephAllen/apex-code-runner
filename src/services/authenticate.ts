"use strict";
const AuthInfo = require("@salesforce/core/lib/authInfo");
const SfdxProject = require("@salesforce/core/lib/sfdxProject");

//import { AuthInfo, SfdxProject } from '@salesforce/core';
import * as vscode from "vscode";
export async function setAuthInfo() {
  //console.log(JSON.stringify)
  const project = await SfdxProject.resolve(vscode.workspace.rootPath);
  const projectConfig = await project.resolveProjectConfig();
  const authInfo = await AuthInfo.create({
    username: "" + projectConfig.defaultdevhubusername,
  });
  const auth = authInfo.getConnectionOptions();
  process.env.APXR_AUTH_INFO = JSON.stringify({
    accessToken: auth.accessToken,
    instanceUrl: auth.instanceUrl,
  });
  process.env.APXR_API_VERSION = "" + projectConfig.sourceApiVersion;
  vscode.commands.executeCommand("setContext", "APXRActive", true);
}
