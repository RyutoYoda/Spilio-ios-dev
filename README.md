# Spilio

**Spilio** is an offline-capable English learning mobile app for Japanese speakers. It covers the full range of English grammar expressions and native-level phrases, with a balanced structure of **input** (lessons, flashcards, example sentences) and **output** (quizzes, fill-in-the-blank, reordering, composition).

## Features

| Feature | Description |
|---------|-------------|
| AI Grammar Analysis | Write English diary entries and receive instant, detailed grammar corrections with explanations |
| Pronunciation Scoring | Record your voice and get AI-powered pronunciation feedback |
| Knowledge Graph | Visualize your learning progress through an interactive graph connecting grammar concepts |
| Review Quizzes | Automatically generated quizzes based on past mistakes |
| Daily Streak Tracking | Stay motivated with streak tracking and daily learning goals |
| Favorites & Bookmarks | Save important corrections and expressions for later review |
| Offline Support | Access diary entries and saved content without an internet connection |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| Navigation | Expo Router |
| State | React Context + AsyncStorage |
| Backend | Express + tRPC |
| Database | PostgreSQL (Drizzle ORM) |
| AI | Server-side LLM integration |

## Project Structure

```
app/              # Screens and navigation (Expo Router)
  (tabs)/         # Tab-based navigation screens
components/       # Reusable UI components
hooks/            # Custom React hooks
lib/              # Utilities, API client, theme
constants/        # Theme and configuration constants
server/           # Backend API (Express + tRPC)
shared/           # Shared types between client and server
assets/images/    # App icons and images
docs/             # Privacy policy and documentation
tests/            # Unit tests
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- Expo Go app (for device testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/RyutoYoda/Spilio-ios-dev.git
cd Spilio-ios-dev

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Running on Device

Scan the QR code displayed in the terminal with the Expo Go app on your iOS or Android device.

## Build & Deployment

This project uses **EAS Build** for creating production builds.

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

See [DEPLOY.md](./DEPLOY.md) for the full App Store submission guide.

## Privacy Policy

The privacy policy is available at:
https://ryutoyoda.github.io/Spilio-ios-dev/privacy-policy.html

## License

All rights reserved. This project is not open-source.

## Author

**Ryuto Yoda** — [@RyutoYoda](https://github.com/RyutoYoda)
