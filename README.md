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

Clone the repo to your machine and install deps:

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

To run the app on iOS:

```sh
pnpm ios
```

To run the app on Android:

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

## 📱 Project Structure

This project follows a feature-based architecture with the following structure:

```
src/
  ├── api/              # API related code
  │   ├── common/       # Common API utilities
  │   └── fortnite/     # Fortnite API hooks and types
  │
  ├── app/              # Expo Router entry point
  │   └── (app)/        # App routes
  │
  ├── components/       # Shared components
  │   ├── ui/           # Core UI components
  │   └── common/       # Common components
  │
  ├── features/         # Feature modules
  │   └── fortnite/     # Fortnite feature
  │       ├── components/  # Feature components
  │       ├── screens/     # Feature screens
  │       ├── hooks/       # Feature hooks
  │       ├── utils/       # Feature utilities
  │       └── store/       # Feature state management
  │
  ├── hooks/            # Shared hooks
  │
  ├── store/            # Global state management
  │
  ├── lib/              # Shared libraries
  │   ├── i18n/         # Internationalization
  │   ├── storage/      # Storage utilities
  │   └── utils/        # Utility functions
  │
  ├── test/             # Test utilities and setup
  │
  ├── translations/     # Translation files
  │
  └── types/            # Shared types
```

### Key Concepts

#### Feature-based Organization

Each feature (e.g., fortnite, settings) has its own directory with components, screens, hooks, utilities, and state management specific to that feature.

#### Component Structure

Components follow a consistent structure:

- Each component has its own directory
- Contains the component file (e.g., `component-name.tsx`), test file, and index.ts

#### API Layer

- **Common Utilities**: Query keys, pagination helpers, URL parameter extraction
- **Fortnite API Hooks**:
  - `useBrItem`: Fetches detailed item information
  - `useShop`: Fetches current shop data

#### Fortnite Feature

The Fortnite feature is organized into:

- **Components**: Shop items, item details, cards, etc.
- **Screens**: Shop screen and item details screen
- **Hooks**: Custom hooks like `useShopItemData`
- **Utils**: Utility functions for shop item data

#### Data Flow

1. API calls are made using hooks from the `@/api/fortnite` directory
2. Data is processed using utilities from the `utils` directory
3. Components use hooks to access and display data
4. Screens compose components to create complete UI views

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)
