// Copyright (c) Cameron Angus.

import { workspace, window, ExtensionContext } from 'vscode';
import * as fs from "fs";

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

const extensionName = 'build2';

let client: LanguageClient;

function getLSPServerLocation(): string | undefined {
	const config = workspace.getConfiguration(`${extensionName}.LSP`);
	return config.get<string>("serverLocation");
}

function startLSPServer(serverLocation: string) {
	if (!fs.existsSync(serverLocation)) {
		window.showErrorMessage(`LSP server executable not found: ${serverLocation}`);
		return;
	}

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { command: serverLocation, transport: TransportKind.stdio },
		debug: {
			command: serverLocation,
			args: ["--wait-debugger"],
			transport: TransportKind.stdio,
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		// @TODO: Look into if we should/how to register custom languages.
		documentSelector: [
			{ scheme: 'file', language: 'build2-manifest' },
			{ scheme: 'file', language: 'buildfile' },
		],
		synchronize: {
			// Notify the server about file changes to files contained in the workspace
			// @NOTE: Believe this is for sending change notifications specifically for files that are outside the workspace.
			fileEvents: [
				workspace.createFileSystemWatcher('**/{manifest,*.manifest}'),
				workspace.createFileSystemWatcher('**/{buildfile,build2file,*.build,*.build2}'),
			],
		}
	};

	client = new LanguageClient(
		extensionName,
		'build2 Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	// @todo: error handling appears awkward.
	// seems we can't just initialize client once and then start/stop, because looks like the server options, which include the path, can only
	// be set via the constructor?
	// So following start can fail (eg. bad executable) and we're left with a non-null but not running client.
	// there's client.onDidChangeState, but unclear how it relates to server state.
	client.start();
}

function stopServer(): Thenable<void> | undefined {
	if (client && client.isRunning()) {
		return client.stop();
	}
	return undefined;
}

export function activate(context: ExtensionContext) {
	const serverLocation = getLSPServerLocation();
	if (serverLocation) {
		startLSPServer(serverLocation);
	} else {
		window.showErrorMessage(`LSP server path is not set. Please configure '${extensionName}.LSP.ServerLocation' in settings.`);
	}

	// Listen for configuration changes
	context.subscriptions.push(
		// @TODO: Some sort of debounce
		workspace.onDidChangeConfiguration(async (event) => {
			if (event.affectsConfiguration(`${extensionName}.LSP.serverLocation`)) {
				const newServerLocation = getLSPServerLocation();
				if (newServerLocation && newServerLocation !== serverLocation) {
					await stopServer();
					startLSPServer(newServerLocation);
				}
			}
		})
	);
}

export function deactivate(): Thenable<void> | undefined {
	return stopServer();
}
