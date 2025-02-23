-- Cosmic Nebula Theme for Eos File Manager
-- A space-inspired theme with dynamic gradients and cosmic effects

-- Define the main colors
local colors = {
    ['--bg-primary'] = '#0a001f',       -- Deep space background
    ['--bg-secondary'] = '#1a0b2e',     -- Lighter space background
    ['--text-primary'] = '#e0e0ff',     -- Starlight text
    ['--text-secondary'] = '#00ffff',   -- Cosmic cyan
    ['--accent'] = '#ff00ff',           -- Nebula pink
    ['--error'] = '#ff3366',            -- Supernova red
    ['--success'] = '#00ff99',          -- Aurora green
    ['--border-radius'] = '8px'         -- Rounded corners
}

-- Return both colors and custom CSS
return {
    colors = colors,
    css = [[
        /* Custom gradients and effects */
        .titlebar {
            background: linear-gradient(90deg, #0a001f 0%, #1a0b2e 50%, #2a1b3e 100%);
            border-bottom: 1px solid #ff00ff;
        }

        .side-panel {
            background: linear-gradient(180deg, #0a001f 0%, #1a0b2e 100%);
            border: 1px solid #ff00ff;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
        }

        .toolbar {
            background: linear-gradient(90deg, #0a001f 0%, #1a0b2e 100%);
            border: 1px solid #ff00ff;
        }

        .file-item:hover {
            background: linear-gradient(90deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
        }

        .quick-access-item:hover {
            background: linear-gradient(90deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%);
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.2);
        }

        /* Animated star background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(1px 1px at 25px 25px, #ffffff 50%, transparent 100%),
                radial-gradient(1px 1px at 50px 50px, #ffffff 50%, transparent 100%),
                radial-gradient(1px 1px at 125px 125px, #ffffff 50%, transparent 100%),
                radial-gradient(1.5px 1.5px at 75px 75px, #ffffff 50%, transparent 100%);
            background-size: 100px 100px;
            animation: stars 8s linear infinite;
            opacity: 0.1;
            z-index: -1;
        }

        @keyframes stars {
            from { transform: translateY(0); }
            to { transform: translateY(-100px); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #ff00ff, #00ffff);
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
        }

        ::-webkit-scrollbar-track {
            background: #0a001f;
        }

        /* Glowing effects */
        .titlebar-text {
            text-shadow: 0 0 10px #00ffff;
        }

        .file-item.selected {
            background: linear-gradient(90deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .toolbar button {
            border-color: #ff00ff;
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
        }

        .toolbar button:hover {
            background: linear-gradient(90deg, #ff00ff, #00ffff);
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
        }

        #currentPath {
            background: rgba(10, 0, 31, 0.8);
            border-color: #00ffff;
            box-shadow: inset 0 0 10px rgba(0, 255, 255, 0.2);
        }

        #currentPath:focus {
            border-color: #00ffff;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        /* Status bar with gradient */
        .status-bar {
            background: linear-gradient(90deg, #0a001f 0%, #1a0b2e 100%);
            border: 1px solid #ff00ff;
        }

        /* Icon glow effects */
        .icon {
            transition: all 0.3s ease;
        }

        .file-item:hover .icon,
        .quick-access-item:hover .icon {
            filter: drop-shadow(0 0 5px var(--accent));
            transform: scale(1.1);
        }
    ]]
}