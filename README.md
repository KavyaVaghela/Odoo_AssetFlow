# AssetFlow - Enterprise Asset & Resource Management System

AssetFlow is a modern, enterprise-grade Asset and Resource Management System designed to handle the complete lifecycle of corporate assets and resource bookings. It features multi-role role-based access control (RBAC), database-enforced integrity checks, and specialized modules for Admins, Employees, Asset Managers, and Department Heads (HODs).

---

## 🚀 Key Modules & Features

### 👤 Role-Based Portals

#### 1. Admin Portal
- **User Management**: Approve pending registration requests, manage active/inactive employee status.
- **Organization Hierarchy**: Configure departments, designations, roles, and asset categories.
- **Audit Trails**: View comprehensive, immutable system-wide activity logs detailing admin, asset, and booking history.

#### 2. Employee Portal
- **Asset Overview**: View list of assets currently allocated/assigned to you.
- **Resource Bookings**: Book shared organizational resources (e.g., conference rooms, projectors, test devices).
- **Maintenance Requests**: Submit issues/maintenance tickets for faulty assets and track their status.
- **Personal Dashboard**: View real-time notifications for approval/rejection updates on requested items.

#### 3. Asset Manager Portal
- **Inventory Control**: Create, edit, and view complete inventories of physical assets.
- **Lifecycle Actions**: Handle asset allocations, returns, and department transfers.
- **QR Operations**: Generate and assign unique QR codes for assets to aid physical auditing.
- **Audit Cycles**: Launch and track inventory verification audits.

#### 4. Department Head (HOD) Portal
- **Department Dashboard**: Visual snapshot of departmental personnel and assets.
- **Request Approvals**: Approve or reject asset allocations and transfer requests originating from your department.
- **Resources Calendar**: View a central calendar showing bookings of department resources.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React (v18) SPA
  - Vite (Build Tool)
  - Tailwind CSS (Styling)
  - Lucide React (Icons)
  - Recharts (Data Visualization)
  - Zustand (State Management)
  - Framer Motion (Micro-animations)
  - Radix UI (Accessible components)

- **Backend**:
  - Node.js & Express.js
  - MySQL 5.7+ / MariaDB 10.2+
  - JSON Web Tokens (JWT) for secure authentication
  - Nodemailer for email notifications
  - Multer for media/image uploads
  - Express-Validator for API validation and sanitization

---

## 📂 Project Structure

```text
Odoo_AssetFlow/
├── client/                 # Frontend React + Vite web client
│   ├── src/
│   │   ├── api/            # API client configurations
│   │   ├── components/     # Shared UI components
│   │   ├── layouts/        # Dashboard layouts
│   │   ├── pages/          # View pages for different portals
│   │   └── services/       # Base Axios instance/interceptors
│   └── package.json
├── server/                 # Backend Express API server
│   ├── config/             # DB connections and third-party setups
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Security and error handlers
│   ├── routes/             # RESTful API endpoints
│   ├── uploads/            # Uploaded profile/asset images
│   └── package.json
├── docs/                   # DB Architecture diagrams & DDL Scripts
│   ├── database_design.md  # Core DB normalization, relationships
│   ├── assets_design.md    # Assets module schema normalization
│   └── employee_design.md  # Employee module schema & validation details
└── package.json            # Root configuration scripts
```

---

## 🗄️ Database Setup & Initialization

### 1. Database Creation
Create a new MySQL database named `assetflow_db`:
```sql
CREATE DATABASE IF NOT EXISTS `assetflow_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Schema Import Sequence
To avoid referential foreign key constraint issues, the SQL scripts must be imported in the following order:

1. [schema.sql](file:///c:/Users/Kavya%20Vaghela/OneDrive/Desktop/Odoo_AssetFlow/docs/schema.sql) - Core tables (departments, designations, users, roles, categories).
2. [assets_schema.sql](file:///c:/Users/Kavya%20Vaghela/OneDrive/Desktop/Odoo_AssetFlow/docs/assets_schema.sql) - Assets inventory, allocations, transfers, returns, and automated state audit triggers.
3. [employee_schema.sql](file:///c:/Users/Kavya%20Vaghela/OneDrive/Desktop/Odoo_AssetFlow/docs/employee_schema.sql) - Resource bookings, overlap validations, maintenance requests, and notification schemas.

---

## ⚙️ Environment Configuration

Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=assetflow_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_token
```

---

## ⚡ Setup & Run Instructions

### 1. Install Dependencies
Run npm install in the root folder, client, and server:
```bash
# In Root
npm install

# In Server
cd server && npm install

# In Client
cd ../client && npm install
```

### 2. Run Demo Seed Script
Before starting the application, run the demo user creation script to insert a seed user with all permissions:
```bash
# In Server directory
node create_demo_user.js
```
This creates a demo account with the following credentials:
- **Email**: `demo@assetflow.com`
- **Password**: `Password123`
- **Assigned Roles**: Admin, Employee, Asset Manager, and Department Head (HOD).

### 3. Spin Up Development Servers
Open two terminals in the root directory:

**Terminal 1 (Start Server)**:
```bash
npm run dev:server
```

**Terminal 2 (Start Client)**:
```bash
npm run dev:client
```
The client will be served at `http://localhost:5173` and backend API runs on `http://localhost:5000`.
