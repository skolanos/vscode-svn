import { Disposable, commands, window, Uri } from 'vscode';
import { SvnSourceControl } from './svn-source-control';

export class SvnCommands {
	private disposables: Disposable[];

	constructor(private svnSourceControl: SvnSourceControl) {
		this.disposables = [];

		this.disposables.push(commands.registerCommand('vscode-svn.status', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.status');

			this.svnSourceControl.getChangesTree().resourceStates = [
				{ resourceUri: new Uri().with({ path: './test-status.txt' }) },
				{ resourceUri: new Uri().with({ path: './src/app/main-status.js' }) },
				{ resourceUri: new Uri().with({ path: './src/stat-status.md' }) },
				{ resourceUri: new Uri().with({ path: './src/lib' }) }
			];

		}));
		this.disposables.push(commands.registerCommand('vscode-svn.diff', () => {
			window.showInformationMessage('To jest polecenie vscode-svn.diff');
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
