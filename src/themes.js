const fs = require('fs');
const path = require('path');
const { dialog } = require('@electron/remote');

// Built-in themes
const themes = {
    'tokyo-night': {
        '--bg-primary': '#1a1b26',
        '--bg-secondary': '#24283b',
        '--text-primary': '#a9b1d6',
        '--text-secondary': '#7aa2f7',
        '--accent': '#bb9af7',
        '--error': '#f7768e',
        '--success': '#9ece6a'
    },
    'monokai': {
        '--bg-primary': '#272822',
        '--bg-secondary': '#3e3d32',
        '--text-primary': '#f8f8f2',
        '--text-secondary': '#a6e22e',
        '--accent': '#fd971f',
        '--error': '#f92672',
        '--success': '#a6e22e'
    },
    'dracula': {
        '--bg-primary': '#282a36',
        '--bg-secondary': '#44475a',
        '--text-primary': '#f8f8f2',
        '--text-secondary': '#6272a4',
        '--accent': '#bd93f9',
        '--error': '#ff5555',
        '--success': '#50fa7b'
    },
    'nord': {
        '--bg-primary': '#2e3440',
        '--bg-secondary': '#3b4252',
        '--text-primary': '#d8dee9',
        '--text-secondary': '#88c0d0',
        '--accent': '#81a1c1',
        '--error': '#bf616a',
        '--success': '#a3be8c'
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = 'tokyo-night';
        this.luaEnabled = false;
        this.luaPath = '';
        this.loadSettings();
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('eosSettings')) || {};
            this.currentTheme = settings.theme || 'tokyo-night';
            this.luaEnabled = settings.luaEnabled || false;
            this.luaPath = settings.luaPath || '';
            this.applyTheme();
        } catch (err) {
            console.error('Error loading settings:', err);
        }
    }

    saveSettings() {
        try {
            const settings = {
                theme: this.currentTheme,
                luaEnabled: this.luaEnabled,
                luaPath: this.luaPath
            };
            localStorage.setItem('eosSettings', JSON.stringify(settings));
        } catch (err) {
            console.error('Error saving settings:', err);
        }
    }

    browseLuaScript() {
        // Create a temporary window for file selection
        const win = getCurrentWindow();
        const fileList = document.getElementById('fileList');
        const currentPath = document.getElementById('currentPath').value;
        
        // Store the current state
        const originalContent = fileList.innerHTML;
        const originalPath = currentPath;
        
        // Update UI for Lua file selection
        document.getElementById('currentPath').value = currentPath;
        this.updateFileList(fileList, currentPath, '.lua');
        
        // Add selection handler
        const selectHandler = (e) => {
            if (e.target.classList.contains('file-item')) {
                const filePath = path.join(currentPath, e.target.querySelector('.name').textContent);
                if (path.extname(filePath) === '.lua') {
                    this.luaPath = filePath;
                    document.getElementById('luaPath').value = filePath;
                    
                    // Restore original content
                    fileList.innerHTML = originalContent;
                    document.getElementById('currentPath').value = originalPath;
                    
                    // Remove temporary handler
                    fileList.removeEventListener('click', selectHandler);
                }
            }
        };
        
        fileList.addEventListener('click', selectHandler);
    }

    updateFileList(fileList, currentPath, filterExt = '.lua') {
        try {
            const entries = fs.readdirSync(currentPath, { withFileTypes: true });
            fileList.innerHTML = '';
            
            entries
                .filter(entry => entry.isDirectory() || path.extname(entry.name) === filterExt)
                .forEach(entry => {
                    const item = document.createElement('div');
                    item.className = 'file-item';
                    
                    const icon = document.createElement('iconify-icon');
                    icon.className = 'icon';
                    icon.setAttribute('icon', entry.isDirectory() ? 'mdi:folder' : 'mdi:language-lua');
                    
                    const name = document.createElement('span');
                    name.className = 'name';
                    name.textContent = entry.name;
                    
                    item.appendChild(icon);
                    item.appendChild(name);
                    fileList.appendChild(item);
                });
        } catch (err) {
            console.error('Error updating file list:', err);
        }
    }

    applyTheme() {
        let themeColors = themes[this.currentTheme];
        let customCSS = '';

        if (this.currentTheme === 'custom' && this.luaEnabled && this.luaPath) {
            try {
                const luaScript = fs.readFileSync(this.luaPath, 'utf8');
                const themeData = this.parseLuaTheme(luaScript);
                
                if (themeData.colors) {
                    themeColors = themeData.colors;
                }
                
                if (themeData.css) {
                    customCSS = themeData.css;
                }
            } catch (err) {
                console.error('Error applying Lua theme:', err);
                themeColors = themes['tokyo-night'];
            }
        }

        // Apply the theme colors
        Object.entries(themeColors).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });

        // Apply custom CSS if any
        let customStyle = document.getElementById('custom-theme-style');
        if (!customStyle) {
            customStyle = document.createElement('style');
            customStyle.id = 'custom-theme-style';
            document.head.appendChild(customStyle);
        }
        customStyle.textContent = customCSS;
    }

    parseLuaTheme(luaScript) {
        try {
            // Simple Lua-like parser for theme data
            const themeData = {
                colors: {},
                css: ''
            };

            // Parse colors table
            const colorsMatch = luaScript.match(/local colors = {([^}]+)}/s);
            if (colorsMatch) {
                const colorLines = colorsMatch[1].split('\n');
                colorLines.forEach(line => {
                    const match = line.match(/\['([^']+)'\]\s*=\s*'([^']+)'/);
                    if (match) {
                        themeData.colors[match[1]] = match[2];
                    }
                });
            }

            // Parse custom CSS
            const cssMatch = luaScript.match(/return \[\[([\s\S]*?)\]\]/);
            if (cssMatch) {
                themeData.css = cssMatch[1];
            }

            return themeData;
        } catch (err) {
            console.error('Error parsing Lua theme:', err);
            return { colors: themes['tokyo-night'], css: '' };
        }
    }
}

module.exports = ThemeManager; 