# gaming_adda

A single Flutter app that hosts multiple board and arcade games. Browse a game-store style shell, pick a game, configure a match, and play — against a built-in AI or a local opponent. Runs on Android, iOS, Linux, macOS, web, and Windows.

## Games

| Game | Category | Modes |
|------|----------|-------|
| **Checkers** | Strategy | vs Computer, local two-player |
| **Ludo** | Family | vs Computer, local hotseat (2–4 players) |
| **Penguin Brothers** | Action | Solo or with an AI partner (bomb/escape arcade, built on [Flame](https://flame-engine.org)) |

## Structure

```
lib/
  main.dart              # app entry — theme + StoreHomeScreen
  navigation.dart        # routes a Game to its setup/play screen by id
  models/game.dart       # Game model
  data/mock_games.dart   # game catalog
  screens/               # store shell (home, detail, generic play)
  theme/                 # app theme + dark/light controller + assets
  widgets/               # shared store widgets + cartoon_ui/ toolkit
  games/
    checkers/            # logic, AI, board, setup + play screens, sounds, theme
    ludo/
    penguin_brothers/    # + components/ and levels/ (Flame game)
```

Each game keeps its own state, rules, move validation, and AI in `lib/games/<game>/`, separate from the shared store shell. A game exposes a `*Config` (play mode, sound, etc.) and a setup screen; `navigation.dart` maps a `Game.id` to the right entry screen.

## Commands

```bash
flutter pub get              # install deps
flutter run                  # run on default device
flutter run -d chrome        # run on a specific device (chrome, linux, macos, ...)
flutter analyze              # lint
dart format .                # format
flutter test                 # all tests
flutter build <apk|web|linux|macos|windows|ipa>   # release build
```

Launcher icons are generated via `flutter_launcher_icons` (config in `pubspec.yaml`); regenerate with `dart run flutter_launcher_icons`.

## Tests

Per-game logic and setup tests live in `test/` (`checkers_*`, `ludo_*`, `penguin_*`), covering rules and starting positions independently of the UI.
