const path = require('path');

const nodeBin = "c:\\Users\\Exequiel rogers\\Desktop\\Nueva carpeta\\bin\\node-v20.10.0-win-x64";
const nodeExe = path.join(nodeBin, "node.exe");

module.exports = {
    apps: [
        {
            name: 'core-backend',
            script: "node_modules/next/dist/bin/next",
            args: "start",
            interpreter: nodeExe,
            autorestart: true,
            max_memory_restart: '500M'
        },
        {
            name: 'strategist',
            script: nodeExe,
            args: 'scripts/strategist.js',
            autorestart: true,
            restart_delay: 5000,
            max_memory_restart: '300M'
        },
        {
            name: 'neural-cns',
            script: nodeExe,
            args: 'scripts/central-nervous-system.js',
            autorestart: true,
            max_memory_restart: '300M'
        },
        {
            name: 'hub-governor',
            script: nodeExe,
            args: 'scripts/autonomous-governance.js',
            autorestart: true,
            max_memory_restart: '300M'
        },
        {
            name: 'self-healer',
            script: nodeExe,
            args: 'scripts/self-healer.js',
            autorestart: true
        },
        {
            name: 'empire-monitor',
            script: nodeExe,
            args: 'scripts/empire-monitor.js',
            autorestart: true
        },
        {
            name: 'billing-governor',
            script: nodeExe,
            args: 'scripts/billing-governor.js',
            autorestart: true,
            restart_delay: 10000
        }
    ]
};
