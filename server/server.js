const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 AssetFlow Admin REST API Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`🚨 Unhandled Promise Rejection: ${err.message}`);
  // Shut down server gracefully
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`🚨 Uncaught Exception: ${err.message}`);
  process.exit(1);
});
