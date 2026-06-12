// Simple structured logger — silent in production for non-errors.
const isDev = process.env.NODE_ENV !== 'production';

const logger = {
  info: (...args) => {
    if (isDev) console.log('[INFO]', ...args);
  },
  warn: (...args) => {
    if (isDev) console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    // Always log errors, even in production
    console.error('[ERROR]', ...args);
  },
};

export default logger;
