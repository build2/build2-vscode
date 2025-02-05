# build2-VSCode

## Outline

VS Code extension project, which currently just serves as a simple client for integration of the [build2-lsp-server](https://github.com/kamrann/build2-lsp-server).

## Project Structure

```
.
├── lsp-client // Language Client
│   ├── src
│   │   ├── test // End to End tests for Language Client / Server
│   │   └── extension.ts // Language Client entry point
├── [add any additional components at this level]
└── package.json // The extension manifest.
```

## Compile and Run

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).

## Package and Install

- Run `npm install -g @vscode/vsce` to install the VS Code extension management command line tool.
- Run `vsce package` in this folder to produce the vsix file.
- To install into VS Code, open the _Extensions_ pane, top-right ellipsis button, _Install from VSIX_.

## Functionality and Usage

See [README.md](./README.md).
