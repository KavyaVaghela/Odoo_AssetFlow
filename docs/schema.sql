-- ============================================================================
-- DATABASE CREATION & CONFIGURATION
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `assetflow_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `assetflow_db`;

-- Set SQL mode to be strict
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- DDL - CREATE TABLES
-- ============================================================================

-- 1. Departments Table
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT,
  `department_name` VARCHAR(100) NOT NULL,
  `department_code` VARCHAR(50) NOT NULL,
  `department_head` INT NULL, -- FK added via ALTER TABLE to break circular dependency
  `description` TEXT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_departments` PRIMARY KEY (`id`),
  CONSTRAINT `uq_department_code` UNIQUE (`department_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Designations Table
DROP TABLE IF EXISTS `designations`;
CREATE TABLE `designations` (
  `id` INT AUTO_INCREMENT,
  `designation_name` VARCHAR(100) NOT NULL,
  `department_id` INT NOT NULL, -- FK added via ALTER TABLE
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_designations` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users Table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT,
  `employee_code` VARCHAR(50) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `profile_image` VARCHAR(255) NULL,
  `department_id` INT NULL, -- FK added via ALTER TABLE
  `designation_id` INT NULL, -- FK added via ALTER TABLE (normalization of designation)
  `joining_date` DATE NOT NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_users` PRIMARY KEY (`id`),
  CONSTRAINT `uq_employee_code` UNIQUE (`employee_code`),
  CONSTRAINT `uq_user_email` UNIQUE (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Roles Table
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT,
  `role_name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_roles` PRIMARY KEY (`id`),
  CONSTRAINT `uq_role_name` UNIQUE (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Roles Table (Many-to-Many Bridge Table)
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL, -- FK added via ALTER TABLE
  `role_id` INT NOT NULL, -- FK added via ALTER TABLE
  `assigned_by` INT NULL, -- FK added via ALTER TABLE (tracks assigner)
  `assigned_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  CONSTRAINT `pk_user_roles` PRIMARY KEY (`id`),
  CONSTRAINT `uq_user_role_assignment` UNIQUE (`user_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Asset Categories Table
DROP TABLE IF EXISTS `asset_categories`;
CREATE TABLE `asset_categories` (
  `id` INT AUTO_INCREMENT,
  `category_name` VARCHAR(100) NOT NULL,
  `category_code` VARCHAR(50) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(100) NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_asset_categories` PRIMARY KEY (`id`),
  CONSTRAINT `uq_category_code` UNIQUE (`category_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Permissions Table
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` INT AUTO_INCREMENT,
  `permission_name` VARCHAR(100) NOT NULL,
  `module_name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_permissions` PRIMARY KEY (`id`),
  CONSTRAINT `uq_permission_name` UNIQUE (`permission_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Role Permissions Table (Many-to-Many Bridge Table)
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id` INT AUTO_INCREMENT,
  `role_id` INT NOT NULL, -- FK added via ALTER TABLE
  `permission_id` INT NOT NULL, -- FK added via ALTER TABLE
  CONSTRAINT `pk_role_permissions` PRIMARY KEY (`id`),
  CONSTRAINT `uq_role_permission` UNIQUE (`role_id`, `permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Activity Logs Table
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NULL, -- FK added via ALTER TABLE
  `module` VARCHAR(50) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `ip_address` VARCHAR(45) NULL, -- Supports IPv4 and IPv6
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_activity_logs` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Notifications Table
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL, -- FK added via ALTER TABLE
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_notifications` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Settings Table (Single-row configuration)
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` INT AUTO_INCREMENT,
  `organization_name` VARCHAR(150) NOT NULL,
  `organization_email` VARCHAR(100) NOT NULL,
  `organization_phone` VARCHAR(20) NULL,
  `organization_logo` VARCHAR(255) NULL,
  `timezone` VARCHAR(100) NOT NULL DEFAULT 'UTC',
  `language` VARCHAR(10) NOT NULL DEFAULT 'en',
  `theme` VARCHAR(20) NOT NULL DEFAULT 'light',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_settings` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DDL - CONSTRAINTS & FOREIGN KEYS (ALTER TABLE)
-- ============================================================================

-- Re-enable key checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Departments -> Head (User)
-- ON DELETE SET NULL allows removing a user who is head without deleting the entire department
ALTER TABLE `departments`
  ADD CONSTRAINT `fk_departments_head`
  FOREIGN KEY (`department_head`) REFERENCES `users` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- 2. Designations -> Departments
-- ON DELETE CASCADE removes designations if the parent department is deleted
ALTER TABLE `designations`
  ADD CONSTRAINT `fk_designations_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- 3. Users -> Departments
-- ON DELETE RESTRICT prevents deleting a department if it contains users
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- 4. Users -> Designations
-- ON DELETE RESTRICT prevents deleting a designation if users hold it
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_designation`
  FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- 5. User Roles -> Users
-- ON DELETE CASCADE deletes the user's role mapping if the user is deleted
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_user`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- 6. User Roles -> Roles
-- ON DELETE RESTRICT prevents deleting a role if users are assigned to it
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_role`
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- 7. User Roles -> Users (Assigned By)
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_assigned_by`
  FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- 8. Role Permissions -> Roles
-- ON DELETE CASCADE deletes the permission mapping if the role is deleted
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_role_permissions_role`
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- 9. Role Permissions -> Permissions
-- ON DELETE CASCADE deletes the mapping if the permission is deleted
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_role_permissions_permission`
  FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

-- 10. Activity Logs -> Users
-- ON DELETE SET NULL retains audit logs for security, setting user_id to NULL if a user is deleted
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_logs_user`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- 11. Notifications -> Users
-- ON DELETE CASCADE deletes notifications if the user is deleted
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_user`
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Note: MySQL automatically indexes primary keys and unique keys.
-- The following indexes are created for foreign key lookups and queries.

-- Departments Lookup
CREATE INDEX `idx_departments_status` ON `departments` (`status`);

-- Designations Foreign Key lookup
CREATE INDEX `idx_designations_department_id` ON `designations` (`department_id`);

-- Users Foreign Key lookups
CREATE INDEX `idx_users_department_id` ON `users` (`department_id`);
CREATE INDEX `idx_users_designation_id` ON `users` (`designation_id`);
CREATE INDEX `idx_users_status` ON `users` (`status`);

-- User Roles lookups
CREATE INDEX `idx_user_roles_user_id` ON `user_roles` (`user_id`);
CREATE INDEX `idx_user_roles_role_id` ON `user_roles` (`role_id`);

-- Role Permissions lookups
CREATE INDEX `idx_role_permissions_role_id` ON `role_permissions` (`role_id`);
CREATE INDEX `idx_role_permissions_permission_id` ON `role_permissions` (`permission_id`);

-- Activity Logs index for date-range audits and user searches
CREATE INDEX `idx_activity_logs_user_id` ON `activity_logs` (`user_id`);
CREATE INDEX `idx_activity_logs_created_at` ON `activity_logs` (`created_at`);
CREATE INDEX `idx_activity_logs_module` ON `activity_logs` (`module`);

-- Notifications index for fetching unread messages for a specific user
CREATE INDEX `idx_notifications_user_id_is_read` ON `notifications` (`user_id`, `is_read`);


-- ============================================================================
-- SAMPLE DATA INSERT STATEMENTS
-- ============================================================================

-- 1. Insert Departments (Without Head initially due to circular constraint)
INSERT INTO `departments` (`id`, `department_name`, `department_code`, `description`, `status`) VALUES
(1, 'Executive', 'EXE', 'Executive Leadership Team', 'Active'),
(2, 'Human Resources', 'HR', 'HR Operations & Talent Acquisition', 'Active'),
(3, 'Information Technology', 'IT', 'IT Infrastructure, Systems & Development', 'Active'),
(4, 'Finance & Accounts', 'FIN', 'Financial planning, accounting & procurement', 'Active');

-- 2. Insert Designations
INSERT INTO `designations` (`id`, `designation_name`, `department_id`, `description`) VALUES
(1, 'Chief Executive Officer', 1, 'Highest ranking executive officer'),
(2, 'HR Manager', 2, 'Manages employee relations and recruitment'),
(3, 'IT Director', 3, 'Oversees the IT division and infrastructure'),
(4, 'Asset Manager', 3, 'Responsible for organization assets and logistics'),
(5, 'Senior Software Engineer', 3, 'Leads software development team projects'),
(6, 'Finance Lead', 4, 'Oversees accounting and procurement');

-- 3. Insert Users
-- (Passwords are BCrypt hashes of 'Password123' for demonstration)
INSERT INTO `users` (`id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `profile_image`, `department_id`, `designation_id`, `joining_date`, `status`) VALUES
(1, 'EMP-001', 'Kavya', 'Vaghela', 'kavya.v@assetflow.com', '+1234567890', '$2b$10$eFytJDGtjbThAOM70G8xOu1G9S3q2h.uN611fC/Yg.Z6d8B19VwXy', 'profile_kavya.png', 3, 3, '2022-01-15', 'Active'),
(2, 'EMP-002', 'Jane', 'Smith', 'jane.smith@assetflow.com', '+1987654321', '$2b$10$eFytJDGtjbThAOM70G8xOu1G9S3q2h.uN611fC/Yg.Z6d8B19VwXy', NULL, 2, 2, '2023-03-01', 'Active'),
(3, 'EMP-003', 'John', 'Doe', 'john.doe@assetflow.com', '+1555019922', '$2b$10$eFytJDGtjbThAOM70G8xOu1G9S3q2h.uN611fC/Yg.Z6d8B19VwXy', 'profile_john.png', 3, 4, '2023-06-15', 'Active'),
(4, 'EMP-004', 'Sarah', 'Connor', 'sarah.connor@assetflow.com', '+1555019944', '$2b$10$eFytJDGtjbThAOM70G8xOu1G9S3q2h.uN611fC/Yg.Z6d8B19VwXy', NULL, 4, 6, '2024-01-10', 'Active');

-- Update Department Heads (Now that users exist)
UPDATE `departments` SET `department_head` = 1 WHERE `id` = 3; -- Kavya is head of IT
UPDATE `departments` SET `department_head` = 2 WHERE `id` = 2; -- Jane is head of HR
UPDATE `departments` SET `department_head` = 4 WHERE `id` = 4; -- Sarah is head of Finance

-- 4. Insert Roles
INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'Admin', 'Full administrative access to settings, user management, and roles'),
(2, 'Employee', 'Standard employee access for requests, notifications, and profile management'),
(3, 'Asset Manager', 'Access to manage, audits, assign, and register assets across departments'),
(4, 'Department Head', 'Department level reports, approval workflows, and asset requests audit');

-- 5. Insert User Roles (Multiple roles per user)
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_by`, `status`) VALUES
-- Kavya Vaghela (Admin + Employee + Department Head)
(1, 1, NULL, 'Active'),
(1, 2, NULL, 'Active'),
(1, 4, NULL, 'Active'),
-- Jane Smith (Employee + Department Head)
(2, 2, 1, 'Active'),
(2, 4, 1, 'Active'),
-- John Doe (Employee + Asset Manager)
(3, 2, 1, 'Active'),
(3, 3, 1, 'Active'),
-- Sarah Connor (Employee + Department Head)
(4, 2, 1, 'Active'),
(4, 4, 1, 'Active');

-- 6. Insert Asset Categories
INSERT INTO `asset_categories` (`id`, `category_name`, `category_code`, `description`, `icon`, `status`) VALUES
(1, 'Laptops & Workstations', 'LAP', 'Standard corporate laptops, desktops, and screens', 'laptop_mac', 'Active'),
(2, 'Mobile Devices', 'MOB', 'Corporate smartphones and tablets', 'phone_iphone', 'Active'),
(3, 'Office Furniture', 'FUR', 'Desks, ergonomic chairs, and filing systems', 'chair', 'Active'),
(4, 'Network Hardware', 'NET', 'Routers, switches, access points, and cabling', 'router', 'Active');

-- 7. Insert Permissions
INSERT INTO `permissions` (`id`, `permission_name`, `module_name`, `description`) VALUES
-- Admin Module Permissions
(1, 'create_user', 'admin', 'Ability to create new users'),
(2, 'edit_user', 'admin', 'Ability to edit user profiles and metadata'),
(3, 'delete_user', 'admin', 'Ability to delete user accounts'),
(4, 'manage_roles', 'admin', 'Ability to assign roles and manage role permissions'),
(5, 'update_settings', 'admin', 'Ability to update organization-wide settings'),
-- Asset Module Permissions (Predefined for future modules integration)
(6, 'create_asset', 'assets', 'Ability to register new assets'),
(7, 'view_assets', 'assets', 'Ability to view asset inventory'),
(8, 'edit_asset', 'assets', 'Ability to update asset logs and state'),
(9, 'audit_assets', 'assets', 'Ability to run audit cycles on assets'),
-- Booking Module Permissions
(10, 'request_booking', 'bookings', 'Ability to request booking/assignment of an asset'),
(11, 'approve_booking', 'bookings', 'Ability to approve asset assignment requests');

-- 8. Insert Role Permissions mappings
-- Admin Role gets all permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11);

-- Employee Role gets basic views and requests
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(2, 7),  -- view_assets
(2, 10); -- request_booking

-- Asset Manager gets asset management, viewing, and auditing
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(3, 6), (3, 7), (3, 8), (3, 9), (3, 10);

-- Department Head gets user views, requests, and approval workflow permissions
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(4, 7), (4, 10), (4, 11);

-- 9. Insert Activity Logs
INSERT INTO `activity_logs` (`user_id`, `module`, `action`, `description`, `ip_address`) VALUES
(1, 'Admin', 'LOGIN', 'Admin user Kavya Vaghela successfully logged in.', '192.168.1.10'),
(1, 'Admin', 'CREATE_USER', 'Created employee account for John Doe (EMP-003)', '192.168.1.10'),
(1, 'Admin', 'ASSIGN_ROLE', 'Assigned role Asset Manager to John Doe', '192.168.1.10');

-- 10. Insert Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
(1, 'Welcome to AssetFlow', 'Your administrative account has been successfully configured.', 'System', 1),
(3, 'Role Assigned', 'You have been assigned the role: Asset Manager by Kavya Vaghela.', 'Alert', 0),
(4, 'Pending Approvals', 'You have 3 pending asset requests awaiting review.', 'Task', 0);

-- 11. Insert Settings
INSERT INTO `settings` (`id`, `organization_name`, `organization_email`, `organization_phone`, `organization_logo`, `timezone`, `language`, `theme`) VALUES
(1, 'AssetFlow Solutions Corp', 'support@assetflow.com', '+18005550199', 'logo_light.svg', 'America/New_York', 'en', 'dark');
