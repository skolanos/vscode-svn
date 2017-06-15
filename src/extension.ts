'use strict';

import * as vscode from 'vscode';

import { SvnSourceControl } from './svn-source-control';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-svn" is now active!');

	context.subscriptions.push(new SvnSourceControl());
}

// this method is called when your extension is deactivated
export function deactivate() {
}
