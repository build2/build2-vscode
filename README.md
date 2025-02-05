# build2-VSCode

Work-in-progress Visual Studio Code extension for build2 integration.

## Functionality

### Languages

Registers custom language IDs for `buildfile`, `manifest` and `testscript` variants.

### LSP

Integrates with [build2-lsp-server]() for providing language support for the above build2 languages.

- LSP connection currently limited to stdio IPC - `build2-lsp-server` executable path must be configured in the extension settings under _Extensions | build2_.
- Minimal syntax highlighting currently implemented for `buildfile` and `manifest`.
