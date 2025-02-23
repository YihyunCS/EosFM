const fs = require('fs');
const path = require('path');
const { dialog, getCurrentWindow } = require('@electron/remote');
const os = require('os');
const { formatDistanceToNow } = require('date-fns');
const ThemeManager = require('./themes');

// Window control handlers
const win = getCurrentWindow();
const minimizeButton = document.getElementById('minimizeButton');
const maximizeButton = document.getElementById('maximizeButton');
const closeButton = document.getElementById('closeButton');

minimizeButton.addEventListener('click', () => {
    win.minimize();
});

maximizeButton.addEventListener('click', () => {
    if (win.isMaximized()) {
        win.unmaximize();
        maximizeButton.querySelector('iconify-icon').setAttribute('icon', 'mdi:window-maximize');
    } else {
        win.maximize();
        maximizeButton.querySelector('iconify-icon').setAttribute('icon', 'mdi:window-restore');
    }
});

closeButton.addEventListener('click', () => {
    win.close();
});

// Update maximize/restore icon when window state changes
win.on('maximize', () => {
    maximizeButton.querySelector('iconify-icon').setAttribute('icon', 'mdi:window-restore');
});

win.on('unmaximize', () => {
    maximizeButton.querySelector('iconify-icon').setAttribute('icon', 'mdi:window-maximize');
});

let currentPath = process.platform === 'win32' ? 'C:\\' : '/';
let selectedIndex = -1;

const fileList = document.getElementById('fileList');
const upButton = document.getElementById('upButton');
const currentPathElement = document.getElementById('currentPath');
const itemCountElement = document.getElementById('itemCount');
const selectedPathElement = document.getElementById('selectedPath');
const sidePanel = document.getElementById('sidePanel');
const togglePanel = document.getElementById('togglePanel');
const refreshButton = document.getElementById('refreshButton');
const newFolderButton = document.getElementById('newFolderButton');

// File type icons using Material Design Icons
const fileIcons = {
    // Folders
    directory: 'mdi:folder',
    downloads: 'mdi:folder-download',
    documents: 'mdi:folder-text',
    pictures: 'mdi:folder-image',
    music: 'mdi:folder-music',
    videos: 'mdi:folder-video',
    desktop: 'mdi:desktop-mac',
    
    // Code files
    js: 'mdi:language-javascript',
    ts: 'mdi:language-typescript',
    jsx: 'mdi:react',
    tsx: 'mdi:react',
    css: 'mdi:language-css3',
    html: 'mdi:language-html5',
    json: 'mdi:code-json',
    py: 'mdi:language-python',
    rs: 'mdi:language-rust',
    go: 'mdi:language-go',
    cpp: 'mdi:language-cpp',
    c: 'mdi:language-c',
    java: 'mdi:language-java',
    
    // Documents
    pdf: 'mdi:file-pdf-box',
    doc: 'mdi:file-word-box',
    docx: 'mdi:file-word-box',
    xls: 'mdi:file-excel-box',
    xlsx: 'mdi:file-excel-box',
    txt: 'mdi:file-document',
    md: 'mdi:language-markdown',
    
    // Media
    mp3: 'mdi:file-music',
    wav: 'mdi:file-music',
    mp4: 'mdi:file-video',
    mkv: 'mdi:file-video',
    avi: 'mdi:file-video',
    jpg: 'mdi:file-image',
    jpeg: 'mdi:file-image',
    png: 'mdi:file-image',
    gif: 'mdi:file-gif-box',
    svg: 'mdi:file-image',
    
    // Archives
    zip: 'mdi:folder-zip',
    rar: 'mdi:folder-zip',
    '7z': 'mdi:folder-zip',
    tar: 'mdi:folder-zip',
    gz: 'mdi:folder-zip',
    
    // Default
    default: 'mdi:file'
};

function getFileIcon(entry) {
    if (entry.isDirectory()) {
        const name = entry.name.toLowerCase();
        if (name === 'downloads') return fileIcons.downloads;
        if (name === 'documents') return fileIcons.documents;
        if (name === 'pictures' || name === 'images') return fileIcons.pictures;
        if (name === 'music') return fileIcons.music;
        if (name === 'videos') return fileIcons.videos;
        if (name === 'desktop') return fileIcons.desktop;
        return fileIcons.directory;
    }
    
    const ext = path.extname(entry.name).toLowerCase().slice(1);
    return fileIcons[ext] || fileIcons.default;
}

// Quick access paths
const quickAccessPaths = {
    HOME: os.homedir(),
    DESKTOP: path.join(os.homedir(), 'Desktop'),
    DOCUMENTS: path.join(os.homedir(), 'Documents'),
    DOWNLOADS: path.join(os.homedir(), 'Downloads')
};

// Add Pictures, Music, and Videos to quick access
const additionalPaths = {
    PICTURES: path.join(os.homedir(), 'Pictures'),
    MUSIC: path.join(os.homedir(), 'Music'),
    VIDEOS: path.join(os.homedir(), 'Videos')
};

Object.assign(quickAccessPaths, additionalPaths);

// Initialize theme manager
const themeManager = new ThemeManager();

// Settings modal elements
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const cancelSettings = document.getElementById('cancelSettings');
const themeSelect = document.getElementById('themeSelect');
const enableLua = document.getElementById('enableLua');
const luaPath = document.getElementById('luaPath');
const browseLua = document.getElementById('browseLua');

// Expand panel button
const expandPanel = document.getElementById('expandPanel');

// Show settings modal with Ctrl+Shift+S
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        openSettings();
    }
    // ... existing keyboard shortcuts ...
});

function openSettings() {
    settingsModal.style.display = 'block';
    themeSelect.value = themeManager.currentTheme;
    enableLua.checked = themeManager.luaEnabled;
    luaPath.value = themeManager.luaPath;
}

closeSettings.onclick = () => {
    settingsModal.style.display = 'none';
};

cancelSettings.onclick = () => {
    settingsModal.style.display = 'none';
};

saveSettings.onclick = () => {
    themeManager.currentTheme = themeSelect.value;
    themeManager.luaEnabled = enableLua.checked;
    themeManager.luaPath = luaPath.value;
    themeManager.saveSettings();
    themeManager.applyTheme();
    settingsModal.style.display = 'none';
};

browseLua.onclick = () => {
    themeManager.browseLuaScript();
};

// Handle expand panel button
expandPanel.onclick = () => {
    sidePanel.classList.remove('collapsed');
};

// Update existing togglePanel click handler
togglePanel.onclick = () => {
    sidePanel.classList.toggle('collapsed');
    const icon = togglePanel.querySelector('iconify-icon');
    icon.setAttribute('icon', sidePanel.classList.contains('collapsed') ? 'mdi:chevron-right' : 'mdi:chevron-left');
};

// Quick access navigation
document.querySelectorAll('.quick-access-item').forEach(item => {
    const pathKey = item.dataset.path;
    const targetPath = quickAccessPaths[pathKey];
    
    item.addEventListener('click', () => {
        if (fs.existsSync(targetPath)) {
            navigateTo(targetPath);
        } else {
            dialog.showErrorBox('Error', `Path not found: ${targetPath}`);
        }
    });
});

// Add Pictures, Music, and Videos to quick access
document.querySelectorAll('.side-panel-footer .quick-access-item').forEach(item => {
    const pathKey = item.textContent.trim().toUpperCase();
    const targetPath = quickAccessPaths[pathKey];
    
    item.addEventListener('click', () => {
        if (fs.existsSync(targetPath)) {
            navigateTo(targetPath);
        } else {
            dialog.showErrorBox('Error', `Path not found: ${targetPath}`);
        }
    });
});

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileDetails(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            size: formatFileSize(stats.size),
            modified: formatDistanceToNow(stats.mtime, { addSuffix: true }),
            created: formatDistanceToNow(stats.birthtime, { addSuffix: true }),
            isDirectory: stats.isDirectory()
        };
    } catch (err) {
        console.error('Error getting file details:', err);
        return null;
    }
}

// Add these near the top with other modal elements
const shortcutsModal = document.getElementById('shortcutsModal');
const closeShortcuts = document.getElementById('closeShortcuts');
const closeShortcutsBtn = document.getElementById('closeShortcutsBtn');

// Add keyboard shortcut handler for Ctrl+Shift+H
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        shortcutsModal.style.display = 'block';
    }
});

// Close shortcuts modal handlers
closeShortcuts.onclick = () => {
    shortcutsModal.style.display = 'none';
};

closeShortcutsBtn.onclick = () => {
    shortcutsModal.style.display = 'none';
};

// Update the file info formatting
function formatFileInfo(details) {
    if (details.isDirectory) {
        return `${details.modified}`;
    }
    return `${details.size} - ${details.modified}`;
}

// Update the updateFileList function to use the new formatting
function updateFileList() {
    currentPathElement.value = currentPath;
    fileList.innerHTML = '';
    selectedIndex = -1;
    
    try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        entries.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        });

        entries.forEach((entry, index) => {
            const fullPath = path.join(currentPath, entry.name);
            const details = getFileDetails(fullPath);
            if (!details) return;

            const item = document.createElement('div');
            item.className = 'file-item';
            item.dataset.index = index;
            
            const icon = document.createElement('iconify-icon');
            icon.className = 'icon';
            icon.setAttribute('icon', getFileIcon(entry));
            
            const nameContainer = document.createElement('div');
            nameContainer.className = 'name-container';
            
            const name = document.createElement('span');
            name.className = 'name';
            name.textContent = entry.name;
            
            const info = document.createElement('span');
            info.className = 'info';
            info.textContent = formatFileInfo(details);
            
            nameContainer.appendChild(name);
            nameContainer.appendChild(info);
            
            const deleteBtn = document.createElement('button');
            const deleteIcon = document.createElement('iconify-icon');
            deleteIcon.setAttribute('icon', 'mdi:delete');
            deleteBtn.appendChild(deleteIcon);
            deleteBtn.title = 'Delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteItem(fullPath);
            };
            
            item.appendChild(icon);
            item.appendChild(nameContainer);
            item.appendChild(deleteBtn);
            
            // Add tooltip with detailed information
            item.title = `Name: ${entry.name}\nSize: ${details.size}\nModified: ${details.modified}\nCreated: ${details.created}`;
            
            if (entry.isDirectory()) {
                item.onclick = () => navigateTo(fullPath);
            }
            
            fileList.appendChild(item);
        });

        itemCountElement.innerHTML = `<iconify-icon icon="mdi:file-multiple"></iconify-icon> ${entries.length} items`;
        updateSelectedItem();
    } catch (err) {
        console.error('Error reading directory:', err);
        dialog.showErrorBox('Error', `Failed to read directory: ${err.message}`);
    }
}

function updateSelectedItem() {
    const items = fileList.querySelectorAll('.file-item');
    items.forEach(item => item.classList.remove('selected'));
    
    if (selectedIndex >= 0 && selectedIndex < items.length) {
        const selectedItem = items[selectedIndex];
        selectedItem.classList.add('selected');
        selectedItem.scrollIntoView({ block: 'nearest' });
        
        const name = selectedItem.querySelector('.name').textContent;
        selectedPathElement.textContent = path.join(currentPath, name);
    }
}

function navigateTo(newPath) {
    try {
        fs.accessSync(newPath);
        currentPath = newPath;
        updateFileList();
    } catch (err) {
        console.error('Error accessing path:', err);
        dialog.showErrorBox('Error', `Failed to access path: ${err.message}`);
    }
}

function navigateUp() {
    const parentPath = path.dirname(currentPath);
    if (parentPath !== currentPath) {
        navigateTo(parentPath);
    }
}

function deleteItem(itemPath) {
    dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${path.basename(itemPath)}?`
    }).then(result => {
        if (result.response === 0) {
            try {
                const stats = fs.statSync(itemPath);
                if (stats.isDirectory()) {
                    fs.rmdirSync(itemPath, { recursive: true });
                } else {
                    fs.unlinkSync(itemPath);
                }
                updateFileList();
            } catch (err) {
                console.error('Error deleting item:', err);
                dialog.showErrorBox('Error', `Failed to delete item: ${err.message}`);
            }
        }
    });
}

// Vim-like keyboard navigation
document.addEventListener('keydown', (e) => {
    const items = fileList.querySelectorAll('.file-item');
    const itemCount = items.length;

    switch (e.key) {
        case 'j':
            selectedIndex = Math.min(selectedIndex + 1, itemCount - 1);
            updateSelectedItem();
            break;
        case 'k':
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelectedItem();
            break;
        case 'g':
            if (e.shiftKey) {
                selectedIndex = itemCount - 1; // G - go to bottom
            } else {
                selectedIndex = 0; // g - go to top
            }
            updateSelectedItem();
            break;
        case 'h':
            navigateUp();
            break;
        case 'l':
        case 'Enter':
            if (selectedIndex >= 0) {
                const selectedItem = items[selectedIndex];
                const icon = selectedItem.querySelector('iconify-icon');
                if (icon.getAttribute('icon') === fileIcons.directory) {
                    const name = selectedItem.querySelector('.name').textContent;
                    navigateTo(path.join(currentPath, name));
                }
            }
            break;
        case 'd':
            if (e.shiftKey && selectedIndex >= 0) { // Shift+D to delete
                const selectedItem = items[selectedIndex];
                const name = selectedItem.querySelector('.name').textContent;
                deleteItem(path.join(currentPath, name));
            }
            break;
    }
});

upButton.onclick = navigateUp;

// Refresh button
refreshButton.onclick = () => {
    updateFileList();
};

// New folder button
newFolderButton.onclick = () => {
    dialog.showInputBox({
        title: 'Create New Folder',
        label: 'Folder Name:',
        defaultInput: 'New Folder'
    }).then(result => {
        if (!result.canceled && result.value) {
            const newFolderPath = path.join(currentPath, result.value);
            try {
                if (!fs.existsSync(newFolderPath)) {
                    fs.mkdirSync(newFolderPath);
                    updateFileList();
                } else {
                    dialog.showErrorBox('Error', 'A folder with this name already exists.');
                }
            } catch (err) {
                console.error('Error creating folder:', err);
                dialog.showErrorBox('Error', `Failed to create folder: ${err.message}`);
            }
        }
    });
};

// Add path input handling
currentPathElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const newPath = currentPathElement.value;
        try {
            if (fs.existsSync(newPath)) {
                const stats = fs.statSync(newPath);
                if (stats.isDirectory()) {
                    navigateTo(newPath);
                } else {
                    dialog.showErrorBox('Error', 'The specified path is not a directory.');
                }
            } else {
                dialog.showErrorBox('Error', 'The specified path does not exist.');
            }
        } catch (err) {
            dialog.showErrorBox('Error', `Invalid path: ${err.message}`);
        }
    }
});

updateFileList(); 