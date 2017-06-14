import { Disposable, scm, SourceControl, SourceControlResourceGroup, Uri } from 'vscode';
import { SvnCommands } from './svn-commands';

export class SvnSourceControl {
	private disposables: Disposable[];
	private sourceControl: SourceControl;
	private changesTree: SourceControlResourceGroup;
	private svnCommands: SvnCommands;

	constructor() {
		this.disposables = [];

		this.sourceControl = scm.createSourceControl('svn', 'Svn');
		this.disposables.push(this.sourceControl);
		this.svnCommands = new SvnCommands(this);
		this.disposables.push(this.svnCommands);
		this.changesTree = this.sourceControl.createResourceGroup('changesTree', 'CHANGES');

		this.changesTree.resourceStates = [
			{ resourceUri: new Uri().with({ path: './test.txt' }) },
			{ resourceUri: new Uri().with({ path: './src/app/main.js' }) }
		];
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
