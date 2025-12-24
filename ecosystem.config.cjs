const path = require('path');

// Ruta absoluta al binario de Node (Windows)
const nodeBin = "C:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64";
const nodeExe = path.join(nodeBin, "node.exe");

module.exports = {
    apps: [
        {
            name: 'core-backend',
            script: nodeExe,
            args: path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next') + ' start',
            env: {
                NODE_ENV: "production",
                OUTBOUND_WEBHOOK_URL: process.env.OUTBOUND_WEBHOOK_URL,
                DATABASE_URL: process.env.DATABASE_URL,
            },
            autorestart: true,
            max_memory_restart: '500M'
        },
        {
            name: 'strategist',
            script: nodeExe,
            args: path.join(__dirname, 'scripts', 'strategist.js'),
            autorestart: true,
            restart_delay: 5000,
            env: {
                NODE_ENV: "production",
            },
            max_memory_restart: '300M'
        },
        {
            name: 'neural-cns',
            script: nodeExe,
            args: path.join(__dirname, 'scripts', 'central-nervous-system.js'),
            autorestart: true,
            env: {
                NODE_ENV: "production",
            },
            max_memory_restart: '300M'
        },
        {
            name: 'hub-governor',
            script: nodeExe,
            args: path.join(__dirname, 'scripts', 'autonomous-governance.js'),
            autorestart: true,
            env: {
                NODE_ENV: "production",
            },
            max_memory_restart: '300M'
        },
        {
            name: 'self-healer',
            script: nodeExe,
            args: path.join(__dirname, 'scripts', 'self-healer.js'),
            autorestart: true,
            env: {
                NODE_ENV: "production",
            }
        },
        {
            name: 'empire-monitor',
            script: nodeExe,
            args: path.join(__dirname, 'scripts', 'empire-monitor.js'),
            autorestart: true,
            env: {
                NODE_ENV: "production",
            }
        }
    ]
};
