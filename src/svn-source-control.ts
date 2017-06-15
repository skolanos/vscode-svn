import { Disposable, scm, SourceControl, SourceControlResourceGroup, Uri, window, workspace, OutputChannel } from 'vscode';

import { SvnCommands } from './svn-commands';

export class SvnSourceControl {
	private disposables: Disposable[];
	private sourceControl: SourceControl;
	private changesTree: SourceControlResourceGroup;
	private outputChannel: OutputChannel;
	private workspaceRootPath: string;
	private svnCommands: SvnCommands;

	constructor() {
		this.disposables = [];
		this.workspaceRootPath = workspace.rootPath;

		this.sourceControl = scm.createSourceControl('svn', 'Svn');
		this.disposables.push(this.sourceControl);

		this.changesTree = this.sourceControl.createResourceGroup('changesTree', 'CHANGES');
		this.disposables.push(this.changesTree);

		this.outputChannel = window.createOutputChannel(this.sourceControl.label);
		this.disposables.push(this.outputChannel);

		this.svnCommands = new SvnCommands(this);
		this.disposables.push(this.svnCommands);

		/* DEBUG: testowa sekcja*/
		this.changesTree.resourceStates = [
			{ resourceUri: new Uri().with({ path: './test.txt' }) },
			{ resourceUri: new Uri().with({ path: './src/app/main.js' }) }
		];

		this.outputChannel.show();
	}
	getWorkspaceRootPath(): string {
		return this.workspaceRootPath;
	}
	getOutputChannel(): OutputChannel {
		return this.outputChannel;
	}
	getChangesTree(): SourceControlResourceGroup {
		return this.changesTree;
	}
	dispose(): void {
		this.disposables.forEach((disposable: Disposable) => {
			disposable.dispose();
		})
	}
}
