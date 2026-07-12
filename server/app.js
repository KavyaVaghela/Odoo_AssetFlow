import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

// Import Routes
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/auth.js';
import hodRoutes from './routes/hod.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/employee', employeeRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AssetFlow API is running' });
});

// 404 Route NotFound
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;
