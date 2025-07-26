# FN Ultra - Fortnite Shop App

<div align="center">
  <img src="./assets/icon.png" width="124px" style="border-radius:10px"/>
</div>

A React Native mobile application that displays the current Fortnite shop items with detailed information including prices, rarity, descriptions, and images.

## 🚀 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **API Client**: [Axios](https://axios-http.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Internationalization**: [i18next](https://www.i18next.com/) with [react-i18next](https://react.i18next.com/)
- **Storage**: [MMKV](https://github.com/mrousavy/react-native-mmkv)
- **UI Components**: Custom components built with NativeWind
- **Testing**: [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📋 Requirements

- [Node.js](https://nodejs.org/en/) (LTS version)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/installation) (Package manager)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall) (for macOS/Linux users)
- [React Native development environment](https://reactnative.dev/docs/environment-setup)
- [Cursor](https://www.cursor.com/) or [VS Code](https://code.visualstudio.com/download) with recommended extensions

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/user/repo-name
cd repo-name
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the app

For iOS:

```bash
pnpm ios
```

For Android:

```bash
pnpm android
```

## 🧪 Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run linting, type checking, and tests:

```bash
pnpm check-all
```

## 📁 Project Structure

The project follows a feature-based architecture:

```
src/
  ├── api/              # API related code
  │   ├── common/       # Common API utilities (pagination, query keys)
  │   └── fortnite/     # Fortnite API hooks and types
  │
  ├── app/              # Expo Router entry point
  │   └── (app)/        # App routes
  │
  ├── components/       # Shared components
  │   └── ui/           # Core UI components (buttons, inputs, etc.)
  │
  ├── features/         # Feature modules
  │   ├── fortnite/     # Fortnite feature
  │   │   ├── components/  # Feature components
  │   │   ├── screens/     # Feature screens
  │   │   ├── hooks/       # Feature hooks
  │   │   └── utils/       # Feature utilities
  │   └── settings/     # Settings feature
  │
  ├── hooks/            # Shared hooks
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

### Key Architecture Concepts

#### Feature-based Organization

Each feature (e.g., fortnite, settings) has its own directory with components, screens, hooks, and utilities specific to that feature.

#### Component Structure

Components follow a consistent structure:

- Each component has its own directory
- Contains the component file, test file, and index.ts for clean exports

#### Data Flow

1. API calls are made using hooks from the `api` directory
2. Data is processed using utilities from the `utils` directory
3. Components use hooks to access and display data
4. Screens compose components to create complete UI views

## 🎮 Features

- **Daily Fortnite Shop**: View current shop items with real-time data
- **Item Details**: See item names, descriptions, prices, rarity, and images
- **Pull to Refresh**: Refresh shop data with pull-to-refresh functionality
- **Dark Mode**: Full dark mode support with automatic theme switching
- **Internationalization**: Support for multiple languages
- **Responsive Design**: Optimized for both iOS and Android devices

## 🎨 Typography & Design System

### Typography

The app uses a comprehensive typography system with two main fonts:

- **FORTNITE BATTLEFEST**: Default font used throughout the app for headings and UI elements (Copyright © SpideRaYsfoNtS. All rights reserved)
- **Inter**: Secondary font used for body text and certain UI elements where readability is critical

#### Text Variants

The `Text` component supports various variants for consistent typography:

```jsx
// Default text uses FORTNITE BATTLEFEST font
<Text>DEFAULT FORTNITE TEXT</Text>

// Explicitly use Inter font when needed
<Text variant="inter">Regular body text</Text>

// Other variants
<Text variant="h1">HEADING 1</Text>
```

Available variants:

- Default: FORTNITE BATTLEFEST font with uppercase styling
- `h1`, `h2`, `h3`, `h4`: Headings with different sizes
- `inter`: Explicitly use Inter font for better readability
- `body`, `bodyLarge`, `bodySmall`: Body text in different sizes (uses Inter)
- `caption`: Small text for secondary information (uses Inter)
- `label`: Form labels and small headings (uses Inter)
- `button`: Button text styling

### Spacing System

The app uses a consistent spacing system:

```jsx
<View className="p-base mb-lg">
  <Text className="mb-sm">Consistent spacing</Text>
</View>
```

Spacing values:

- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `base`: 1rem (16px)
- `md`: 1.25rem (20px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 2.5rem (40px)
- `3xl`: 3rem (48px)
- `4xl`: 4rem (64px)

### Color System

The app uses a comprehensive color system with:

- Base colors (primary, neutral, etc.)
- Semantic colors (success, warning, danger)
- Contrast colors for accessibility
- Special Fortnite-themed colors

## 📱 Available Scripts

- `pnpm start` - Start the development server
- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
