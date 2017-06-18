import { Disposable, commands, window, Uri } from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';

import { SvnSourceControl } from './svn-source-control';

export class SvnCommands {
	private disposables: Disposable[];

	constructor(private svnSourceControl: SvnSourceControl) {
		this.disposables = [];

		this.disposables.push(commands.registerCommand('vscode-svn.status', () => {
			let workspaceRootPath: string = this.svnSourceControl.getWorkspaceRootPath();

			this.svnSourceControl.getOutputChannel().appendLine(`vscode-svn.status\tsvn status ${workspaceRootPath}`);

			child_process.exec(`svn status ${workspaceRootPath}`, (error: Error, stdout: string, stderr: string) => {
				if (error) {
					window.showErrorMessage(`Wystąpił bład w poleceniu vscode-svn.status: ${error.message}`);
					return;
				}
				if (stderr !== '') {
					window.showErrorMessage(`Wystąpił bład w poleceniu vscode-svn.status: ${stderr}`);
					return;
				}
				// DEBUG: stdout = 'M2345678./test-status.txt\n?2345678./src/app/main-status.js\n?2345678./src/stat-status.md';
				let elements: string[] = stdout.split('\n');
				this.svnSourceControl.getChangesTree().resourceStates = elements.map((element: string) => {
					let attr = element.substr(0, 8);
					let fileName = element.substr(8).trim();
					return { resourceUri: new Uri().with({ path: fileName }), decorations: {iconPath: Uri.file(this.getPathForFileStateIcon(attr))} };
				});
			});
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.diff', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.diff');
			/*
			this.svnSourceControl.getChangesTree().resourceStates = [
				{ resourceUri: new Uri().with({ path: './test-status.txt' }), decorations: {iconPath: Uri.file(this.getPathForFileStateIcon('C2345678')) } },
				{ resourceUri: new Uri().with({ path: './src/app/main-status.js' }) },
				{ resourceUri: new Uri().with({ path: './src/stat-status.md' }) },
				{ resourceUri: new Uri().with({ path: './src/lib' }) }
			];
			*/
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.update-all', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.update-all');
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.update', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.update');
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.commit', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.commit');
		}));
	}
	getPathForFileStateIcon(fileState: string): string {
		let iconName = '';

		switch (fileState.substr(0, 1)) {
		case ' ': iconName = 'stat01.png'; break;
		case 'A': iconName = 'stat02.png'; break;
		case 'D': iconName = 'stat03.png'; break;
		case 'M': iconName = 'stat04.png'; break;
		case 'R': iconName = 'stat05.png'; break;
		case 'C': iconName = 'stat06.png'; break;
		case 'X': iconName = 'stat07.png'; break;
		case 'I': iconName = 'stat08.png'; break;
		case '?': iconName = 'stat09.png'; break;
		case '!': iconName = 'stat10.png'; break;
		case '~': iconName = 'stat11.png'; break;
		default:  iconName = 'stat01.png';
		}

		return path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', iconName);
	}
	dispose(): void {
		this.disposables.forEach((disposable: Disposable) => {
			disposable.dispose();
		})
	}
}
