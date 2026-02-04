#!/bin/bash
# Script to automatically configure the frontend environment

if [ -n "$CODESPACE_NAME" ]; then
    echo "Detected Codespace: $CODESPACE_NAME"
    echo "REACT_APP_CODESPACE_NAME=$CODESPACE_NAME" > .env
    echo "✅ Created .env file with REACT_APP_CODESPACE_NAME=$CODESPACE_NAME"
else
    echo "❌ CODESPACE_NAME environment variable not found"
    echo "Please set it manually in the .env file"
    echo "You can find it in your browser URL: https://[CODESPACE_NAME].github.dev"
fi
