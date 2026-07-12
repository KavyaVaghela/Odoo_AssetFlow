-- ============================================================================
-- ASSETFLOW - ASSET MANAGEMENT MODULE DATABASE SCHEMA
-- ============================================================================
-- Designed for MySQL 5.7+ / MariaDB 10.2+
-- Integrates with existing Core/Admin tables:
--   - users
--   - departments
--   - asset_categories
-- ============================================================================

USE `assetflow_db`;

-- Set SQL mode to handle foreign key dependencies cleanly during setup
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- DDL - CREATE TABLES
-- ============================================================================

-- 1. Assets Table
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `id` INT AUTO_INCREMENT,
  `asset_code` VARCHAR(100) NOT NULL,
  `asset_name` VARCHAR(150) NOT NULL,
  `asset_category_id` INT NOT NULL, -- FK to asset_categories
  `department_id` INT NOT NULL,     -- FK to departments
  `serial_number` VARCHAR(100) NULL,
  `brand` VARCHAR(100) NULL,
  `model` VARCHAR(100) NULL,
  `purchase_date` DATE NOT NULL,
  `purchase_cost` DECIMAL(12, 2) NOT NULL,
  `vendor_name` VARCHAR(150) NULL,
  `warranty_expiry` DATE NULL,
  `asset_image` VARCHAR(255) NULL,
  `qr_code` VARCHAR(255) NOT NULL,
  `current_status` ENUM('Available', 'Allocated', 'Under Maintenance', 'Transferred', 'Returned', 'Disposed', 'Lost') NOT NULL DEFAULT 'Available',
  `condition` ENUM('Excellent', 'Good', 'Fair', 'Damaged', 'Needs Repair', 'Disposed') NOT NULL DEFAULT 'Good',
  `location` VARCHAR(150) NULL,
  `description` TEXT NULL,
  `created_by` INT NULL,            -- FK to users
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_assets` PRIMARY KEY (`id`),
  CONSTRAINT `uq_asset_code` UNIQUE (`asset_code`),
  CONSTRAINT `uq_asset_serial` UNIQUE (`serial_number`),
  CONSTRAINT `uq_asset_qr` UNIQUE (`qr_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Asset Allocations Table
DROP TABLE IF EXISTS `asset_allocations`;
CREATE TABLE `asset_allocations` (
  `id` INT AUTO_INCREMENT,
  `asset_id` INT NOT NULL,          -- FK to assets
  `employee_id` INT NOT NULL,       -- FK to users
  `allocated_by` INT NULL,          -- FK to users
  `allocation_date` DATE NOT NULL,
  `expected_return_date` DATE NULL,
  `actual_return_date` DATE NULL,
  `allocation_status` ENUM('Active', 'Returned', 'Cancelled') NOT NULL DEFAULT 'Active',
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Virtual generated column to enforce that at most ONE allocation is 'Active' per asset
  -- It evaluates to the asset_id if Active, else NULL. UNIQUE index allows multiple NULLs.
  `active_allocation_uid` INT GENERATED ALWAYS AS (IF(`allocation_status` = 'Active', `asset_id`, NULL)) VIRTUAL,
  CONSTRAINT `pk_asset_allocations` PRIMARY KEY (`id`),
  CONSTRAINT `uq_active_asset_allocation` UNIQUE (`active_allocation_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Asset Transfers Table
DROP TABLE IF EXISTS `asset_transfers`;
CREATE TABLE `asset_transfers` (
  `id` INT AUTO_INCREMENT,
  `asset_id` INT NOT NULL,          -- FK to assets
  `from_department` INT NOT NULL,   -- FK to departments
  `to_department` INT NOT NULL,     -- FK to departments
  `from_employee` INT NOT NULL,     -- FK to users
  `to_employee` INT NOT NULL,       -- FK to users
  `transfer_reason` TEXT NULL,
  `approved_by` INT NULL,           -- FK to users
  `transfer_date` DATE NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_asset_transfers` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Asset Returns Table
DROP TABLE IF EXISTS `asset_returns`;
CREATE TABLE `asset_returns` (
  `id` INT AUTO_INCREMENT,
  `asset_id` INT NOT NULL,          -- FK to assets
  `employee_id` INT NOT NULL,       -- FK to users
  `received_by` INT NULL,           -- FK to users
  `return_date` DATE NOT NULL,
  `asset_condition` ENUM('Excellent', 'Good', 'Fair', 'Damaged', 'Needs Repair', 'Disposed') NOT NULL,
  `damage_notes` TEXT NULL,
  `status` ENUM('Completed', 'Pending Inspection') NOT NULL DEFAULT 'Completed',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_asset_returns` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Asset History Table (Audit Trail)
DROP TABLE IF EXISTS `asset_history`;
CREATE TABLE `asset_history` (
  `id` INT AUTO_INCREMENT,
  `asset_id` INT NOT NULL,          -- FK to assets
  `performed_by` INT NULL,          -- FK to users
  `action` VARCHAR(100) NOT NULL,   -- e.g. 'Asset Registered', 'Allocated', 'Transferred', 'Status Changed'
  `old_value` VARCHAR(255) NULL,
  `new_value` VARCHAR(255) NULL,
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_asset_history` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DDL - CONSTRAINTS & FOREIGN KEYS (ALTER TABLE)
-- ============================================================================

-- Re-enable constraints checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Assets constraints
ALTER TABLE `assets`
  ADD CONSTRAINT `fk_assets_category`
  FOREIGN KEY (`asset_category_id`) REFERENCES `asset_categories` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_assets_department`
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_assets_creator`
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Asset Allocations constraints
ALTER TABLE `asset_allocations`
  ADD CONSTRAINT `fk_allocations_asset`
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_allocations_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_allocations_assigner`
  FOREIGN KEY (`allocated_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. Asset Transfers constraints
ALTER TABLE `asset_transfers`
  ADD CONSTRAINT `fk_transfers_asset`
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_transfers_from_dept`
  FOREIGN KEY (`from_department`) REFERENCES `departments` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_transfers_to_dept`
  FOREIGN KEY (`to_department`) REFERENCES `departments` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_transfers_from_emp`
  FOREIGN KEY (`from_employee`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_transfers_to_emp`
  FOREIGN KEY (`to_employee`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_transfers_approver`
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Asset Returns constraints
ALTER TABLE `asset_returns`
  ADD CONSTRAINT `fk_returns_asset`
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_returns_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_returns_receiver`
  FOREIGN KEY (`received_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. Asset History constraints
ALTER TABLE `asset_history`
  ADD CONSTRAINT `fk_history_asset`
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_history_user`
  FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;


-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Assets Lookup
CREATE INDEX `idx_assets_status` ON `assets` (`current_status`);
CREATE INDEX `idx_assets_condition` ON `assets` (`condition`);
CREATE INDEX `idx_assets_category_id` ON `assets` (`asset_category_id`);
CREATE INDEX `idx_assets_department_id` ON `assets` (`department_id`);

-- Asset Allocations Lookup
CREATE INDEX `idx_allocations_asset_id` ON `asset_allocations` (`asset_id`);
CREATE INDEX `idx_allocations_employee_id` ON `asset_allocations` (`employee_id`);
CREATE INDEX `idx_allocations_status` ON `asset_allocations` (`allocation_status`);

-- Asset Transfers Lookup
CREATE INDEX `idx_transfers_asset_id` ON `asset_transfers` (`asset_id`);
CREATE INDEX `idx_transfers_from_dept` ON `asset_transfers` (`from_department`);
CREATE INDEX `idx_transfers_to_dept` ON `asset_transfers` (`to_department`);

-- Asset Returns Lookup
CREATE INDEX `idx_returns_asset_id` ON `asset_returns` (`asset_id`);
CREATE INDEX `idx_returns_employee_id` ON `asset_returns` (`employee_id`);

-- Asset History Lookup
CREATE INDEX `idx_history_asset_id` ON `asset_history` (`asset_id`);
CREATE INDEX `idx_history_created_at` ON `asset_history` (`created_at`);


-- ============================================================================
-- AUTOMATED CHANGE-AUDITING DATABASE TRIGGERS
-- ============================================================================

DELIMITER //

-- Trigger 1: Record log in history when a new asset is registered
DROP TRIGGER IF EXISTS `trg_assets_after_insert`//
CREATE TRIGGER `trg_assets_after_insert`
AFTER INSERT ON `assets`
FOR EACH ROW
BEGIN
  INSERT INTO `asset_history` (
    `asset_id`, 
    `performed_by`, 
    `action`, 
    `old_value`, 
    `new_value`, 
    `remarks`
  )
  VALUES (
    NEW.`id`, 
    NEW.`created_by`, 
    'Asset Registered', 
    NULL, 
    NEW.`asset_code`, 
    CONCAT('Registered new asset "', NEW.`asset_name`, '" with Serial: ', COALESCE(NEW.`serial_number`, 'N/A'))
  );
END;
//

-- Trigger 2: Record logs in history when asset fields are updated (status, condition, location)
DROP TRIGGER IF EXISTS `trg_assets_after_update`//
CREATE TRIGGER `trg_assets_after_update`
AFTER UPDATE ON `assets`
FOR EACH ROW
BEGIN
  -- 1. Status Change Log
  IF OLD.`current_status` <> NEW.`current_status` THEN
    INSERT INTO `asset_history` (`asset_id`, `performed_by`, `action`, `old_value`, `new_value`, `remarks`)
    VALUES (NEW.`id`, NULL, 'Status Changed', OLD.`current_status`, NEW.`current_status`, 'System state update.');
  END IF;

  -- 2. Condition Change Log
  IF OLD.`condition` <> NEW.`condition` THEN
    INSERT INTO `asset_history` (`asset_id`, `performed_by`, `action`, `old_value`, `new_value`, `remarks`)
    VALUES (NEW.`id`, NULL, 'Condition Changed', OLD.`condition`, NEW.`condition`, 'Asset physical condition report update.');
  END IF;

  -- 3. Location Change Log
  IF COALESCE(OLD.`location`, '') <> COALESCE(NEW.`location`, '') THEN
    INSERT INTO `asset_history` (`asset_id`, `performed_by`, `action`, `old_value`, `new_value`, `remarks`)
    VALUES (NEW.`id`, NULL, 'Location Changed', OLD.`location`, NEW.`location`, 'Physical location relocation.');
  END IF;
END;
//

DELIMITER ;


-- ============================================================================
-- SAMPLE DATA SEED STATEMENTS
-- ============================================================================

-- 1. Seed assets
-- (Presumes asset_categories 1 (LAP), 2 (MOB), 3 (FUR) and departments 2 (HR), 3 (IT) exist)
INSERT INTO `assets` (`id`, `asset_code`, `asset_name`, `asset_category_id`, `department_id`, `serial_number`, `brand`, `model`, `purchase_date`, `purchase_cost`, `vendor_name`, `warranty_expiry`, `asset_image`, `qr_code`, `current_status`, `condition`, `location`, `description`, `created_by`) VALUES
(1, 'AST-LAP-001', 'MacBook Pro 16" M3 Max', 1, 3, 'SN-MBP3MAX8829', 'Apple', 'MacBook Pro M3 Max 16-inch', '2024-02-10', 3499.00, 'Apple Enterprise Store', '2026-02-10', 'macbook_m3.png', 'QR-AF-AST-LAP-001', 'Allocated', 'Excellent', 'IT Labs - Floor 3', 'High-performance laptop for system developers.', 1),
(2, 'AST-LAP-002', 'ThinkPad T14 Gen 4', 1, 2, 'SN-TPT14G4-7162', 'Lenovo', 'ThinkPad T14 Gen 4', '2024-04-15', 1250.00, 'Lenovo Business Solutions', '2027-04-15', NULL, 'QR-AF-AST-LAP-002', 'Available', 'Good', 'Inventory Closet - Room A', 'Standard work laptop for HR operations.', 1),
(3, 'AST-MOB-001', 'iPhone 15 Pro Max 256GB', 2, 3, 'SN-IPH15PM-0012', 'Apple', 'iPhone 15 Pro Max', '2024-03-01', 1199.00, 'Apple Retail', '2025-03-01', 'iphone15.png', 'QR-AF-AST-MOB-001', 'Allocated', 'Good', 'IT Labs - Floor 3', 'Corporate testing mobile device.', 1),
(4, 'AST-FUR-001', 'Ergonomic Desk Chair', 3, 3, 'SN-STEELCASE-1123', 'Steelcase', 'Gesture', '2023-08-20', 1050.00, 'Steelcase Corporate Sales', '2028-08-20', NULL, 'QR-AF-AST-FUR-001', 'Available', 'Good', 'Workspace Cube 4', 'Ergonomic support seating.', 1);

-- 2. Seed asset allocations
-- (Allocates AST-LAP-001 (id=1) to user John Doe (id=3) by Admin user Kavya (id=1))
INSERT INTO `asset_allocations` (`id`, `asset_id`, `employee_id`, `allocated_by`, `allocation_date`, `expected_return_date`, `actual_return_date`, `allocation_status`, `remarks`) VALUES
(1, 1, 3, 1, '2024-02-12', '2025-02-12', NULL, 'Active', 'Standard developer allocation.'),
-- Allocates and returns AST-MOB-001 (id=3)
(2, 3, 3, 1, '2024-03-02', '2024-06-02', '2024-06-02', 'Returned', 'Mobile device assigned for 3 months application test cycle.');

-- 3. Seed asset transfers
-- (AST-LAP-001 (id=1) transferred from IT (id=3) to HR (id=2), by Employee John (id=3) to Jane (id=2), approved by Admin Kavya (id=1))
INSERT INTO `asset_transfers` (`id`, `asset_id`, `from_department`, `to_department`, `from_employee`, `to_employee`, `transfer_reason`, `approved_by`, `transfer_date`, `status`, `remarks`) VALUES
(1, 1, 3, 2, 3, 2, 'HR Department project testing requirements.', 1, '2024-06-15', 'Approved', 'Transfer successfully authorized and logged.');

-- 4. Seed asset returns
-- (Returns AST-MOB-001 (id=3) by John (id=3), received by Admin Kavya (id=1))
INSERT INTO `asset_returns` (`id`, `asset_id`, `employee_id`, `received_by`, `return_date`, `asset_condition`, `damage_notes`, `status`) VALUES
(1, 3, 3, 1, '2024-06-02', 'Good', 'No physical damages. Screen cleaned.', 'Completed');

-- Note: The asset_history table is automatically seeded for inserts and status changes by triggers `trg_assets_after_insert` and `trg_assets_after_update`.
