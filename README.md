# Eos File Manager

A modern, elegant file manager built with Electron, featuring a clean UI and vim-like keyboard shortcuts.

## Features

- 🎨 Beautiful, modern UI with multiple themes
- ⌨️ Vim-like keyboard navigation
- 📁 Quick access to common directories
- 🎯 Collapsible sidebar
- 🎨 Custom theme support via Lua scripts
- ⚡ Fast and lightweight
- 🔍 File search and navigation
- 🖥️ Cross-platform support

## Installation

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eos-file-manager.git
cd eos-file-manager
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the application in development mode:
```bash
npm run dev
```

### Building

Build for your current platform:
```bash
npm run build
```

Build for specific platforms:
```bash
# Build for ARM
npm run build:arm

# Build for x64
npm run build:x64

# Build for all platforms
npm run build:all
```

## Keyboard Shortcuts

### Navigation
- `j` - Move down
- `k` - Move up
- `h` - Go to parent directory
- `l` - Open directory
- `g` - Go to top
- `G` - Go to bottom

### Actions
- `Shift + D` - Delete selected item
- `Enter` - Open selected item
- `Ctrl + R` - Refresh

### Application
- `Ctrl + Shift + S` - Open settings
- `Ctrl + Shift + H` - Show shortcuts

## Themes

Eos File Manager comes with several built-in themes:
- Tokyo Night (Default)
- Monokai
- Dracula
- Nord

### Custom Themes

You can create custom themes using Lua scripts. To use a custom theme:

1. Open Settings (`Ctrl + Shift + S`)
2. Select "Custom (Lua)" from the theme dropdown
3. Enable Lua Styling
4. Browse and select your Lua theme file
5. Click "Save Changes"

## License

MIT License - see LICENSE file for details

## Credits

Created by Yihyun 
