/**
 * lib/env-validator.ts
 * 
 * Ensures all required environment variables are present before the system starts.
 * This is a key step in moving from "prototype" to "real" SaaS.
 */

const REQUIRED_ENV_VARS = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "MERCADO_PAGO_ACCESS_TOKEN",
    "MERCADO_PAGO_WEBHOOK_SECRET",
    "SENDGRID_API_KEY",
    "EMAIL_FROM",
    "OUTBOUND_WEBHOOK_URL",
    "CURRENCY",
];

export function validateEnv() {
    const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

    if (missing.length > 0) {
        console.warn("\x1b[33m%s\x1b[0m", "⚠️  WARNING: Missing environment variables:");
        missing.forEach((v) => console.log(`   - ${v}`));
        console.log("\x1b[33m%s\x1b[0m", "The system might fail or operate in degraded mode.");
        return false;
    }

    console.log("\x1b[32m%s\x1b[0m", "✅ Environment variables validated.");
    return true;
}
