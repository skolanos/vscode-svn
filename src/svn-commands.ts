import { Disposable, commands, window, Uri } from 'vscode';
import * as child_process from 'child_process';

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
				let elements: string[] = stdout.split('\n');
				this.svnSourceControl.getChangesTree().resourceStates = elements.map((element: string) => {
					let attr = element.substr(0, 8);
					let fileName = element.substr(8).trim();
					return { resourceUri: new Uri().with({ path: fileName }) };
				});
			});
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.diff', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.diff');
			/*
			this.svnSourceControl.getChangesTree().resourceStates = [
				{ resourceUri: new Uri().with({ path: './test-status.txt' }) },
				{ resourceUri: new Uri().with({ path: './src/app/main-status.js' }) },
				{ resourceUri: new Uri().with({ path: './src/stat-status.md' }) },
				{ resourceUri: new Uri().with({ path: './src/lib' }) }
			];
			*/
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.update', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.update');
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.commit', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.commit');
		}));
	}
	dispose(): void {
		this.disposables.forEach((disposable: Disposable) => {
			disposable.dispose();
		})
	}
}
