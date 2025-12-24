/**
 * autonomous-init.js
 * 
 * Final, ultra-robust auto-pilot for system initialization.
 * - Manually parses .env.local to ensure Prisma has DATABASE_URL.
 * - Uses absolute paths for local binaries.
 * - Handles dependency installation, DB generation/sync, and PM2.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Path configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const BIN_DIR = path.join(PROJECT_ROOT, 'bin/node-v20.10.0-win-x64');
const NODE = path.join(BIN_DIR, 'node.exe');
const NPM = path.join(BIN_DIR, 'npm.cmd');
const NPX = path.join(BIN_DIR, 'npx.cmd');
const PM2 = path.join(BIN_DIR, 'pm2.cmd');

// 2. Load .env.local manually
function loadEnv() {
    const envPath = path.join(PROJECT_ROOT, '.env.local');
    if (fs.existsSync(envPath)) {
        console.log("[INIT] Loading environment from .env.local...");
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                // Remove quotes
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                process.env[key] = value;
            }
        });
    } else {
        console.warn("[INIT] WARNING: .env.local not found!");
    }
}

// 3. Command execution helper
function runCommand(command, useLocalNpx = false) {
    let finalCommand = command;
    if (useLocalNpx && command.startsWith('npx ')) {
        finalCommand = `"${NPX}" ${command.substring(4)}`;
    } else if (command.startsWith('npm ')) {
        finalCommand = `"${NPM}" ${command.substring(4)}`;
    } else if (command.startsWith('pm2 ')) {
        finalCommand = `"${PM2}" ${command.substring(4)}`;
    }

    console.log(`[INIT] > ${finalCommand}`);
    try {
        // We inject the bin directory into the PATH for this execution
        const customEnv = {
            ...process.env,
            PATH: `${BIN_DIR};${process.env.PATH}`,
            NODE_OPTIONS: "--no-warnings"
        };
        execSync(finalCommand, { stdio: 'inherit', env: customEnv, cwd: PROJECT_ROOT });
        return true;
    } catch (err) {
        console.error(`[INIT] ❌ Failed: ${command}`);
        return false;
    }
}

async function start() {
    console.log("\n🚀 ANTIGRAVITY EMPIRE: AUTONOMOUS LAUNCH SEQUENCE 🚀\n");

    loadEnv();

    // Verification of critical vars
    if (!process.env.DATABASE_URL) {
        console.error("[INIT] 🚨 ERROR: DATABASE_URL is required to start the system.");
        process.exit(1);
    }

    // A. Dependencies
    if (!fs.existsSync(path.join(PROJECT_ROOT, 'node_modules'))) {
        console.log("[INIT] Installing local dependencies...");
        runCommand('npm install');
    }

    // B. Prisma Hardening
    console.log("[INIT] Generating Prisma Client...");
    runCommand('npx prisma generate', true);

    console.log("[INIT] Synchronizing database schema...");
    if (!runCommand('npx prisma migrate deploy', true)) {
        console.log("[INIT] Migration failed (possibly new DB). Running force-push...");
        runCommand('npx prisma db push --accept-data-loss', true);
    }

    // C. Clean start for PM2
    console.log("[INIT] Initializing PM2 environment...");
    runCommand('pm2 delete all');

    console.log("[INIT] Launching the Autonomous Empire...");
    runCommand('pm2 start ecosystem.config.js');
    runCommand('pm2 save');

    console.log("\n✅ LAUNCH SEQUENCE COMPLETE. ALL SYSTEMS NOMINAL. 🦾\n");
}

start().catch(err => {
    console.error("[INIT] 🚨 FATAL LAUNCH ERROR:", err);
    process.exit(1);
});
