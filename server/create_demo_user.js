import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const createDemoUser = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'assetflow_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const email = 'demo@assetflow.com';
    const password = 'Password123';
    
    // Check if demo user already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Demo user already exists. ID:', existing[0].id);
      
      // Ensure they have all roles
      const userId = existing[0].id;
      const roles = [1, 2, 3, 4]; // Admin, Employee, Asset Manager, Department Head
      for (const roleId of roles) {
        await pool.query('INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
      }
      console.log('Roles verified/updated for existing demo user.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const [insertRes] = await pool.query(
      `INSERT INTO users (employee_code, first_name, last_name, email, password_hash, status, approval_status, joining_date) 
       VALUES ('DEMO-001', 'Demo', 'User', ?, ?, 'Active', 'Approved', CURDATE())`,
      [email, passwordHash]
    );
    const newUserId = insertRes.insertId;
    console.log('Created demo user with ID:', newUserId);

    // Assign ALL roles (1=Admin, 2=Employee, 3=Asset Manager, 4=Department Head)
    const roles = [1, 2, 3, 4];
    for (const roleId of roles) {
      await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [newUserId, roleId]);
    }
    
    console.log('Assigned all roles (Admin, Employee, Asset Manager, Department Head) to demo user.');
    console.log(`Login Credentials:\nEmail: ${email}\nPassword: ${password}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

createDemoUser();
