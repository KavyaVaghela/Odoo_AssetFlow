import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js'; // Ensure database connects on startup

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`AssetFlow Backend Server is running on port ${PORT}`);
});
