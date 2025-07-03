<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
FN Ultra - Fortnite Shop App </h1>

> A React Native app for viewing the current Fortnite shop items

## Requirements

- [React Native dev environment ](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Cursor](https://www.cursor.com/) or [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/user/repo-name

cd ./repo-name

pnpm install
```

### Environment Setup

Create a `.env.development` file in the root directory with the following variables:

```sh
# API Configuration
API_URL=https://jsonplaceholder.typicode.com
FORTNITE_API_URL=https://fortnite-api.com

# Environment Variables
VAR_NUMBER=42
VAR_BOOL=true

# Build Time Variables
SECRET_KEY=your-secret-key-here
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

## 🎮 Features

- **Daily Fortnite Shop**: View current shop items with real-time data from the Fortnite API
- **Item Details**: See item names, descriptions, prices, rarity, and images
- **Pull to Refresh**: Refresh shop data with pull-to-refresh functionality
- **Dark Mode Support**: Full dark mode support with automatic theme switching
- **Responsive Design**: Optimized for both iOS and Android devices

## 🧪 Testing

Run the test suite:

```sh
pnpm test
```

Run tests in watch mode:

```sh
pnpm test:watch
```

## 📱 App Structure

```
src/
  ├── api/fortnite/          # Fortnite API integration
  ├── components/fortnite/   # Fortnite-specific UI components
  ├── app/                   # Expo Router screens
  └── lib/                   # Shared utilities and hooks
```

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)
