'use strict';

import * as vscode from 'vscode';

import { SvnSourceControl } from './svn-source-control';
import * as tmp from 'tmp';

const svnSourceControl: SvnSourceControl = new SvnSourceControl();
let cleanupTmpDirCallback: any;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-svn" is now active!');

	// utworzenie tymczasowego katalogu na kopie robocze plików
	tmp.dir(tmp._gracefulCleanup, (error, tmpPath, cleanupCallback) => {
		if (error) {
			vscode.window.showErrorMessage(`Error message: ${error.message}`);
			return;
		}
		cleanupTmpDirCallback = cleanupCallback;
		svnSourceControl.setTmpDir(tmpPath);

		context.subscriptions.push(svnSourceControl);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	// jeżeli katalog tymczasowy został utworzony to jego usunięcie
	if (svnSourceControl.getTmpDir() !== '') {
		cleanupTmpDirCallback();
	}
}
