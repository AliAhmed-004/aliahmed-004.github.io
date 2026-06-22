# Up Next - Digital Freecycling Platform

## Final Year Project Documentation

## Project Overview
**Up Next** is a Flutter application for digital freecycling. It allows users to list unwanted items, discover items nearby, book available listings, and coordinate through in-app chat. The project aims to reduce waste and encourage reuse by making local item sharing simple and accessible.

The app was originally designed with a mobile-first approach, and the current codebase also supports responsive layouts for tablet, desktop, and web.

---

## Live Demo

Try the hosted web version: [https://aliahmed-004.github.io/upnext-frontend/#/home](https://aliahmed-004.github.io/upnext-frontend/#/home)


## Problem Statement
Many households accumulate unused but still useful items. Without a trusted and location-aware platform for redistribution, those items often remain unused or are discarded.

This leads to:

- limited storage space being wasted
- avoidable landfill waste
- missed reuse opportunities
- difficulty connecting with local recipients
- poor trust and coordination in informal giveaway channels

---

## Solution
Up Next addresses these issues by providing a community platform where users can:

- create free item listings
- browse listings nearby
- book items they want
- manage their own listings and bookings
- communicate with other users through chat
- use map-based location selection and address resolution

---

## Core Features

### 1. Authentication and Verification
- Sign up and sign in with Supabase Auth
- Email verification flow before full access
- Protected routes for private pages
- Guest-only routing for login and sign-up screens

### 2. Listings Management
- Create listings with title, description, category, and location
- Upload images for listings
- Edit active listings
- Delete owned listings
- View owned listings and manage them from dedicated screens

### 3. Discovery Feed
- Browse available listings from other users
- Filter by category
- Filter nearby listings by radius
- Pull to refresh
- Real-time home feed updates from Supabase changes

### 4. Booking Workflow
- Book available listings
- View booked listings
- Cancel bookings
- Automatic status tracking with `active`, `booked`, and `inactive`

### 5. Profile and Preferences
- View and update profile details
- Update current location
- Change username
- See listing and booking counts
- Persist theme preference with system, light, and dark modes

### 6. In-App Messaging
- View all chat rooms
- Open one-to-one conversations
- Send and receive messages

### 7. Web and UX Safeguards
- Route protection for private pages
- Conditional access to `/verification_pending`
- Unauthorized fallback UI for invalid protected states
- 404 page for unknown routes
- Responsive layouts for small phones, tablets, and large screens

---

## Technologies and Tools Used

### Frontend
- **Flutter**
- **Dart**
- **Material Design 3**

### Backend
- **Supabase**
  - PostgreSQL database
  - authentication
  - realtime subscriptions
  - storage for listing images

### State Management and Navigation
- **Provider**
  - `UserProvider`
  - `ListingProvider`
  - `ThemeProvider`
- **GetX** for navigation and route handling

### Maps and Location
- **Geolocator**
- **Geocoding**
- **flutter_map**
- **latlong2**
- **MapTiler API**

### Local Persistence
- **shared_preferences** for theme persistence

### Media
- **image_picker** for selecting listing images

### Testing
- **flutter_test**
- **mocktail**
- **integration_test**

---

## Current Architecture

### Application Structure
```text
lib/
├── core/
│   ├── constants/
│   ├── models/
│   ├── navigation/
│   ├── pages/
│   ├── providers/
│   ├── services/
│   ├── theme/
│   ├── utils/
│   └── widgets/
├── features/
│   ├── auth/
│   ├── chat/
│   ├── listings/
│   └── profile/
└── main.dart
```

### Core Layer
- `core/constants/` - environment values and shared constants
- `core/models/` - shared models such as `ListingModel`, `UserModel`, `Message`, and `ListingFilter`
- `core/navigation/` - GetX route middleware
- `core/pages/` - shared pages such as the 404 page
- `core/providers/` - app-wide state containers
- `core/services/` - Supabase-backed services
- `core/theme/` - theme setup and persistence
- `core/utils/` - helper methods and responsive utilities
- `core/widgets/` - reusable widgets

### Feature Layer
- `features/auth/` - auth entry, login, sign-up, verification pending
- `features/chat/` - chat room list and conversation page
- `features/listings/` - feed, create/edit/details, manage, booked, and map picker
- `features/profile/` - profile page and settings

---

## Key Services

### `SupabaseAuthService`
- sign up
- sign in
- sign out
- access current auth state

### `SupabaseUserService`
- fetch current user profile
- fetch user by ID
- update username
- update location

### `SupabaseListingService`
- fetch all listings
- fetch nearby listings
- fetch current user's listings
- fetch booked listings
- create, update, delete, and book listings

### `SupabaseStorageService`
- upload and manage listing images

### `SupabaseChatService`
- fetch user chat rooms
- fetch messages
- send messages
- subscribe to realtime message updates

---

## Data Models

### User Model
- `id`
- `username`
- `email`
- `latitude`
- `longitude`

### Listing Model
- `id`
- `title`
- `description`
- `category`
- `status`
- `userId`
- `latitude`
- `longitude`
- `createdAt`
- `bookedBy`
- `bookedAt`
- `imageUrls`

### Message Model
- message content
- sender metadata
- room/user linkage
- timestamp metadata

### Listing Filter
- home-feed category filtering state

---

## Feature Implementation Notes

### Location-Based Discovery
- Listings can be shown using the user's saved location
- Nearby search radius is adjustable from the home screen
- Users without a saved location fall back to a broader feed
- Coordinates are converted into readable addresses for display

### Realtime Home Feed
- The home feed listens for insert, update, and delete changes on listings
- Feed state refreshes through `ListingProvider`

### Listing Lifecycle
1. A user creates a listing with optional images and location
2. Other users browse the feed and open listing details
3. A user books an item
4. Listing status updates through provider state and backend changes
5. Owners can manage, edit, or delete their own active listings

### Responsive UI
- Breakpoint-based layout helpers live in `lib/core/utils/responsive.dart`
- Content is constrained on large screens
- Listing cards adapt to available width
- Forms, lists, dialogs, and chat layouts are responsive across screen sizes

---

## Security and Routing

### Authentication Rules
- Verified users can access protected pages
- Unauthenticated users are redirected to login
- Authenticated but unverified users are redirected to `/verification_pending`

### Middleware
- `AuthMiddleware` protects private routes
- `GuestMiddleware` redirects logged-in users away from guest screens
- `VerificationPendingMiddleware` protects `/verification_pending`

### Fallback Screens
- Unauthorized fallback UI for protected-page edge cases
- 404 page for unknown routes

### Backend Security
- Supabase Auth for session management
- Row-level security enforced in Supabase

---

## User Interface

### Theme System
- light theme
- dark theme
- system theme
- persistent theme selection with `shared_preferences`

### Reusable Widgets
- `CustomButton`
- `CustomTextfield`
- `CustomSnackbar`
- `ListingTile`
- `ItemLocationMap`
- `MessageBubble`
- `UnauthorizedView`

---

## Navigation Structure

### Public or Conditional Routes
- `/auth` - authentication entry point
- `/login` - login screen
- `/signup` - sign-up screen
- `/verification_pending` - only for authenticated but unverified users

### Protected Routes
- `/home` - main listing feed
- `/profile` - profile page
- `/create_listing` - create listing
- `/edit_listing` - edit listing
- `/pick_location` - location picker
- `/user_listings` - owned listings view
- `/manage_listings` - manage owned listings
- `/booked_listings` - booked items
- `/chat` - chat page

### Global Routing Behavior
- unknown routes show a 404 page

---

## Database and Backend Notes

### Users Table
- `id`
- `email`
- `username`
- `latitude`
- `longitude`

### Listings Table
- `id`
- `user_id`
- `title`
- `description`
- `category`
- `status`
- `latitude`
- `longitude`
- `created_at`
- `booked_by`
- `booked_at`
- image references managed through Supabase Storage

### Chat Data
- room data
- messages data

---

## Installation and Setup

### Prerequisites
- Flutter SDK
- Dart SDK
- a Supabase project
- a MapTiler API key

### Configuration
1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Configure values in `lib/core/constants/env.dart`
   - `supabaseUrl`
   - `supabaseAnonKey`
   - `mapApiKey`
4. Run the app:
   ```bash
   flutter run
   ```

### Useful Commands
```bash
flutter pub get
flutter run
flutter test
flutter test integration_test/
flutter analyze
dart format lib/
dart run flutter_launcher_icons
```

---

## Current Dependency Snapshot

Key packages from `pubspec.yaml`:
- `provider: ^6.1.5+1`
- `get: ^4.6.6`
- `flutter_map: ^8.2.2`
- `latlong2: ^0.9.1`
- `intl: ^0.20.2`
- `geolocator: ^14.0.2`
- `geocoding: ^4.0.0`
- `supabase_flutter: ^2.12.0`
- `shared_preferences: ^2.5.3`
- `image_picker: ^1.2.1`
- `flutter_launcher_icons: ^0.14.4`

---

## Testing

The repository currently includes:
- unit tests for selected models
- unit tests for selected services
- widget test scaffolding
- mock Supabase client helpers

---

## Future Enhancements
- full-text search across listings
- push notifications
- ratings or trust signals
- richer profile and community features
- moderation and reporting tools

---

## Conclusion
Up Next combines Flutter, Supabase, realtime updates, location-aware discovery, responsive UI design, guarded routing, chat, and image-backed listings to create a practical digital freecycling platform.

---

## License
This project is part of an academic final year project.
