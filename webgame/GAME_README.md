# 🧠 Number Sequence Memory Game

A fun and challenging memory game built with Vue 3 and Vuex!

## Game Overview

Test your memory by remembering the positions of numbers on a grid and clicking them in the correct sequence (1, 2, 3...).

## How to Play

1. **Select a Difficulty Level:**
   - **Level 1 (Easy)**: 3x3 grid, 4 numbers, 5 seconds to memorize
   - **Level 2 (Medium)**: 4x4 grid, 6 numbers, 4 seconds to memorize
   - **Level 3 (Hard)**: 5x5 grid, 8 numbers, 3 seconds to memorize

2. **Memorization Phase:**
   - Numbers will appear on the grid
   - Remember their positions
   - Watch the countdown timer

3. **Playing Phase:**
   - After the timer expires, numbers disappear
   - Click the cells in the correct order (1, 2, 3...)
   - Green cells indicate correct clicks
   - Wrong click ends the game

## Scoring System

- Earn **10 points** per correct click × level multiplier
- Earn **50 bonus points** × level multiplier for completing a level
- Example: Level 3 completion = 80 + 150 = 230 points minimum

## Features

- 📊 Real-time score tracking
- ⏱️ Countdown timer during memorization
- 🎨 Beautiful gradient UI with smooth animations
- 🎯 Three difficulty levels
- 🔄 Play again or return to menu options
- ✨ Responsive design
- 🎵 **Sound effects** - Victory and defeat melodies using Web Audio API
- 😊 **Dynamic emojis** - Fetched from Emoji API (happy face for win, sad face for lose)
- 💫 **Advanced animations** - Bounce effect on win, shake effect on lose, modal pop-up

## Technical Stack

- **Vue 3** - Progressive JavaScript framework
- **Vuex 4** - State management
- **Vite** - Build tool and dev server

## Running the Game

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build
```

## Game States

- `idle` - Level selection screen
- `memorizing` - Show numbers with countdown
- `playing` - Player clicks numbers
- `won` - All numbers clicked correctly
- `lost` - Wrong number clicked

## Project Structure

```
src/
├── components/
│   ├── bigbox.vue    # Game grid component
│   ├── levels.vue    # Level selection
│   └── result.vue    # Win/lose modal
├── store/
│   └── index.js      # Vuex store (game state)
├── App.vue           # Main app component
└── main.js           # App entry point
```

Enjoy the game! 🎮
