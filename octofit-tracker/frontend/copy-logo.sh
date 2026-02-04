#!/bin/bash
# Script to copy logo files to the frontend public directory

echo "Copying OctoFit logo files..."
cp /workspaces/flai-workshop-github-copilot-800/docs/octofitapp-small.png /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend/public/octofitapp-logo.png
cp /workspaces/flai-workshop-github-copilot-800/docs/octofitapp-small.png /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend/public/favicon.png
cp /workspaces/flai-workshop-github-copilot-800/docs/octofitapp-small.png /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend/public/logo192.png
cp /workspaces/flai-workshop-github-copilot-800/docs/octofitapp-small.png /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend/public/logo512.png

echo "✅ Logo files copied successfully!"
echo "Files created:"
echo "  - octofitapp-logo.png (main logo)"
echo "  - favicon.png (browser tab icon)"
echo "  - logo192.png (PWA icon)"
echo "  - logo512.png (PWA icon)"
