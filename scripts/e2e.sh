#!/usr/bin/env bash

export CODE_TESTS_PATH="$(pwd)/lsp-client/out/test"
export CODE_TESTS_WORKSPACE="$(pwd)/lsp-client/testFixture"

node "$(pwd)/lsp-client/out/test/runTest"
