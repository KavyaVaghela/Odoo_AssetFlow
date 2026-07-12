const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const adminRoutes = require('./routes/admin');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ==========================================
// Middleware Configurations
// ==========================================

// Enable Cross-Origin Resource Sharing
app.use(cors());

// HTTP request logger (console output for development)
app.use(morgan('dev'));

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Custom DB request auditor (logs successful POST, PUT, DELETE write operations)
app.use(requestLogger);

// ==========================================
// Base API Routing
// ==========================================

app.use('/api/admin', adminRoutes);

// Root test endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AssetFlow Admin Module REST API Server.'
  });
});

// Capture undefined routes (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - Path ${req.originalUrl} does not exist`);
  error.statusCode = 404;
  next(error);
});

// ==========================================
// Global Error Handler Mount
// ==========================================
app.use(errorHandler);

module.exports = app;
