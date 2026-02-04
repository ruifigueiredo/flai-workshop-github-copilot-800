# Starting the OctoFit Tracker Frontend

## Prerequisites

Before starting the frontend, you need to configure the environment to connect to the backend API.

## Step 1: Set up the environment variable

### Option A: Automatic Setup (In Codespaces)

Run the setup script from the frontend directory:

```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
chmod +x setup-env.sh
./setup-env.sh
```

### Option B: Manual Setup

1. Find your Codespace name:
   ```bash
   echo $CODESPACE_NAME
   ```
   
2. Or look at your browser URL: `https://[YOUR-CODESPACE-NAME].github.dev`

3. Create/edit the `.env` file:
   ```bash
   cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
   echo "REACT_APP_CODESPACE_NAME=your-actual-codespace-name" > .env
   ```

## Step 2: Install dependencies (if not already done)

```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
npm install
```

## Step 3: Start the frontend

```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
npm start
```

The app will start on port 3000 and should be accessible at:
`https://[YOUR-CODESPACE-NAME]-3000.app.github.dev`

## Troubleshooting

### Issue: "REACT_APP_CODESPACE_NAME is undefined"

**Solution**: Make sure the `.env` file exists and contains:
```
REACT_APP_CODESPACE_NAME=your-actual-codespace-name
```

### Issue: "Cannot connect to backend API"

**Solutions**:
1. Verify the backend is running on port 8000
2. Check that port 8000 is set to "public" visibility in Codespaces
3. Verify the CODESPACE_NAME in `.env` matches your actual codespace name

### Issue: CORS errors

**Solution**: Ensure the Django backend has CORS configured properly in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://{}-3000.app.github.dev".format(os.environ.get('CODESPACE_NAME', 'localhost')),
]
```

## Verification

Once started, open the browser console (F12) and check for:
- Log showing the CODESPACE_NAME
- Log showing the backend API base URL
- Successful API calls to each endpoint

## Quick Start Commands (All-in-One)

```bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend
chmod +x setup-env.sh && ./setup-env.sh
npm install
npm start
```
