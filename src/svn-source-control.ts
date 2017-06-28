import { Disposable, scm, SourceControl, SourceControlResourceGroup, Uri, window, workspace, OutputChannel, FileSystemWatcher, commands } from 'vscode';

import { SvnCommands } from './svn-commands';

export class SvnSourceControl {
	private disposables: Disposable[];
	private sourceControl: SourceControl;
	private changesTree: SourceControlResourceGroup;
	private outputChannel: OutputChannel;
	private workspaceRootPath: string;
	private tmpDir: string;
	private fileSystemWatcher: FileSystemWatcher;
	private svnCommands: SvnCommands;

	constructor() {
		this.disposables = [];

		this.tmpDir = '';

		// pobranie ścieżki dla workspace
		this.workspaceRootPath = workspace.rootPath;

		this.sourceControl = scm.createSourceControl('svn', 'Svn');
		this.disposables.push(this.sourceControl);
		this.sourceControl.quickDiffProvider = this;

		this.svnCommands = new SvnCommands(this);
		this.disposables.push(this.svnCommands);

		// utworzenie grupy na panelu SOURCE CONTROL
		this.changesTree = this.sourceControl.createResourceGroup('changesTree', 'CHANGES');
		this.disposables.push(this.changesTree);

		// utworzenie strumienia z info. na zakładce OUTPUT
		this.outputChannel = window.createOutputChannel(this.sourceControl.label);
		this.disposables.push(this.outputChannel);
		this.outputChannel.show();

		// reagowanie na zmiany w strukturze plików w projekcie
		this.fileSystemWatcher = workspace.createFileSystemWatcher(`${this.workspaceRootPath}/**/*`);
		this.disposables.push(this.fileSystemWatcher);
		this.fileSystemWatcher.onDidChange(fileSystemWatcherEvent);
		this.fileSystemWatcher.onDidCreate(fileSystemWatcherEvent);
		this.fileSystemWatcher.onDidDelete(fileSystemWatcherEvent);
		fileSystemWatcherEvent();
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
	setTmpDir(tmpDir: string): void {
		this.tmpDir = tmpDir;
	}
	getTmpDir(): string {
		return this.tmpDir;
	}
	dispose(): void {
		this.disposables.forEach((disposable: Disposable) => {
			disposable.dispose();
		})
	}
}

function fileSystemWatcherEvent(): void {
	// console.log('wywołanie fileSystemWatcherEvent()');
	commands.executeCommand('vscode-svn.status');
}
