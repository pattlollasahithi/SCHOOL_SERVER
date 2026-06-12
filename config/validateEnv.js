// Validate required environment variables on startup.
// Fails fast with a clear message if any are missing.

const required = [
  'MONGO_URI',
  'JWT_SECRET',
];

const optional = [
  'PORT',
  'NODE_ENV',
  'CORS_ORIGIN',
  'EMAIL_USER',
  'EMAIL_PASS',
  'GROQ_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\n❌ FATAL: Missing required environment variables:\n`);
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error(`\nCreate a .env file based on .env.example and provide all required values.\n`);
    process.exit(1);
  }

  // Warn about missing optional vars that affect features
  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(`\n⚠️  Optional environment variables not set: ${missingOptional.join(', ')}\n`);
  }
}
