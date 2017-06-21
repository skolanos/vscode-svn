import { Disposable, commands, window, Uri, SourceControlResourceState } from 'vscode';
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
					window.showErrorMessage(`Error message: ${error.message}`);
					return;
				}
				if (stderr !== '') {
					window.showErrorMessage(`Error message: ${stderr}`);
					return;
				}
				// DEBUG: stdout = 'M2345678./test-status.txt\n?2345678./src/app/main-status.js\n?2345678./src/stat-status.md';
				let elements: string[] = stdout.split('\n');
				this.svnSourceControl.getChangesTree().resourceStates = elements.filter((element: string) => {
					return element !== '';
				}).map((element: string) => {
					let attr = element.substr(0, 8);
					let fileName = element.substr(8).trim();
					let resourceState: SourceControlResourceState = {
						command: {
							command: 'vscode-svn.open-diff-view',
							title: 'Open Diff View'
						},
						resourceUri: new Uri().with({ scheme: 'file', path: fileName }),
						decorations: { iconPath: Uri.file(this.getPathForFileStateIcon(attr)) }
					};
					resourceState.command.arguments = [resourceState];
					return resourceState;
				});
			});
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.open-diff-view', (resourceState: SourceControlResourceState) => {
			window.showInformationMessage('To jest polecenie vscode-svn.open-diff-view'); // TODO:

			// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			commands.executeCommand<void>('vscode.open', resourceState.resourceUri);
			//commands.executeCommand<void>('vscode.diff', resourceState.resourceUri, new Uri().with({ scheme: 'svn', query: 'HEAD', path: resourceState.resourceUri.path}), path.basename(resourceState.resourceUri.path));
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.diff', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.diff'); // TODO:
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.update-all', () => {
			let workspaceRootPath: string = this.svnSourceControl.getWorkspaceRootPath();

			this.svnSourceControl.getOutputChannel().appendLine(`vscode-svn.update-all\tsvn update ${workspaceRootPath}`);

			child_process.exec(`svn update ${workspaceRootPath}`, (error: Error, stdout: string, stderr: string) => {
				if (error) {
					window.showErrorMessage(`Error message: ${error.message}`);
					return;
				}
				if (stderr !== '') {
					window.showErrorMessage(`Error message: ${stderr}`);
					return;
				}
				commands.executeCommand('vscode-svn.status');
			});
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.update', (...resourceStates: SourceControlResourceState[]) => {
			if (resourceStates.length === 0) {
				window.showErrorMessage('No files selected for update.');
			}
			else {
				let filesPath = '';
				resourceStates.forEach((resource: SourceControlResourceState) => {
					filesPath += resource.resourceUri.fsPath + ' ';
				});
				filesPath = filesPath.trim();
				if (filesPath !== '') {
					this.svnSourceControl.getOutputChannel().appendLine(`vscode-svn.update\tsvn update ${filesPath}`);

					child_process.exec(`svn update ${filesPath}`, (error: Error, stdout: string, stderr: string) => {
						if (error) {
							window.showErrorMessage(`Error message: ${error.message}`);
							return;
						}
						if (stderr !== '') {
							window.showErrorMessage(`Error message: ${stderr}`);
							return;
						}
						commands.executeCommand('vscode-svn.status');
					});
				}
			}
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.commit-all', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.commit-all'); // TODO:
		}));
		this.disposables.push(commands.registerCommand('vscode-svn.commit', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.commit'); // TODO:
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
