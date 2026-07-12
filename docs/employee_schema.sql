-- ============================================================================
-- ASSETFLOW - EMPLOYEE MODULE DATABASE SCHEMA
-- ============================================================================
-- Designed for MySQL 5.7+ / MariaDB 10.2+
-- Integrates with existing Core/Admin & Assets tables:
--   - users
--   - assets
-- ============================================================================

USE `assetflow_db`;

-- Set SQL mode to handle foreign key dependencies cleanly during setup
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- DDL - CREATE TABLES
-- ============================================================================

-- 1. Resource Bookings Table
DROP TABLE IF EXISTS `resource_bookings`;
CREATE TABLE `resource_bookings` (
  `id` INT AUTO_INCREMENT,
  `resource_id` INT NOT NULL,      -- FK to assets (Projectors, conference rooms, etc.)
  `employee_id` INT NOT NULL,      -- FK to users
  `booking_title` VARCHAR(150) NOT NULL,
  `purpose` TEXT NULL,
  `booking_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
  `approved_by` INT NULL,          -- FK to users
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_resource_bookings` PRIMARY KEY (`id`),
  CONSTRAINT `chk_booking_times` CHECK (`start_time` < `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Booking History Table
DROP TABLE IF EXISTS `booking_history`;
CREATE TABLE `booking_history` (
  `id` INT AUTO_INCREMENT,
  `booking_id` INT NOT NULL,       -- FK to resource_bookings
  `action` VARCHAR(100) NOT NULL,  -- e.g. 'Created', 'Approved', 'Cancelled'
  `performed_by` INT NULL,         -- FK to users
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_booking_history` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Maintenance Requests Table
DROP TABLE IF EXISTS `maintenance_requests`;
CREATE TABLE `maintenance_requests` (
  `id` INT AUTO_INCREMENT,
  `asset_id` INT NOT NULL,         -- FK to assets
  `employee_id` INT NOT NULL,      -- FK to users
  `issue_title` VARCHAR(150) NOT NULL,
  `issue_description` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  `status` ENUM('Pending', 'Approved', 'Assigned', 'In Progress', 'Completed', 'Rejected') NOT NULL DEFAULT 'Pending',
  `requested_date` DATE NOT NULL,
  `assigned_to` INT NULL,          -- FK to users (Technician)
  `completed_date` DATE NULL,
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `pk_maintenance_requests` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Employee Requests Table (Service Requests)
DROP TABLE IF EXISTS `employee_requests`;
CREATE TABLE `employee_requests` (
  `id` INT AUTO_INCREMENT,
  `employee_id` INT NOT NULL,      -- FK to users
  `request_type` ENUM('Asset Request', 'Software Installation', 'Hardware Upgrade', 'Access Request', 'General Request') NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected', 'Completed') NOT NULL DEFAULT 'Pending',
  `approved_by` INT NULL,          -- FK to users
  `request_date` DATE NOT NULL,
  `completed_date` DATE NULL,
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_employee_requests` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Employee Notifications Table
DROP TABLE IF EXISTS `employee_notifications`;
CREATE TABLE `employee_notifications` (
  `id` INT AUTO_INCREMENT,
  `employee_id` INT NOT NULL,      -- FK to users
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `notification_type` VARCHAR(50) NOT NULL, -- e.g. 'Alert', 'Booking', 'Maintenance'
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `pk_employee_notifications` PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- DDL - CONSTRAINTS & FOREIGN KEYS (ALTER TABLE)
-- ============================================================================

-- Re-enable constraints checks
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Resource Bookings constraints
ALTER TABLE `resource_bookings`
  ADD CONSTRAINT `fk_bookings_resource`
  FOREIGN KEY (`resource_id`) REFERENCES `assets` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_bookings_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_bookings_approver`
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. Booking History constraints
ALTER TABLE `booking_history`
  ADD CONSTRAINT `fk_bh_booking`
  FOREIGN KEY (`booking_id`) REFERENCES `resource_bookings` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_bh_performer`
  FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 3. Maintenance Requests constraints
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `fk_maintenance_asset`
  FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_maintenance_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_maintenance_technician`
  FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Employee Requests constraints
ALTER TABLE `employee_requests`
  ADD CONSTRAINT `fk_erequests_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE,
  
  ADD CONSTRAINT `fk_erequests_approver`
  FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 5. Employee Notifications constraints
ALTER TABLE `employee_notifications`
  ADD CONSTRAINT `fk_enotifications_employee`
  FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;


-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Resource Bookings search & overlap optimization
CREATE INDEX `idx_bookings_resource_date` ON `resource_bookings` (`resource_id`, `booking_date`);
CREATE INDEX `idx_bookings_employee` ON `resource_bookings` (`employee_id`);
CREATE INDEX `idx_bookings_status` ON `resource_bookings` (`status`);

-- Booking History
CREATE INDEX `idx_bh_booking_id` ON `booking_history` (`booking_id`);

-- Maintenance Requests search optimizations
CREATE INDEX `idx_maintenance_asset` ON `maintenance_requests` (`asset_id`);
CREATE INDEX `idx_maintenance_employee` ON `maintenance_requests` (`employee_id`);
CREATE INDEX `idx_maintenance_status` ON `maintenance_requests` (`status`);

-- Employee Requests optimizations
CREATE INDEX `idx_erequests_employee` ON `employee_requests` (`employee_id`);
CREATE INDEX `idx_erequests_status` ON `employee_requests` (`status`);

-- Employee Notifications dashboard optimizations
CREATE INDEX `idx_enotifications_emp_read` ON `employee_notifications` (`employee_id`, `is_read`);


-- ============================================================================
-- BUSINESS LOGIC TRIGGER CHECKS
-- ============================================================================

DELIMITER //

-- Trigger 1: Prevent booking overlaps and check resource availability (Insert validation)
DROP TRIGGER IF EXISTS `trg_bookings_before_insert`//
CREATE TRIGGER `trg_bookings_before_insert`
BEFORE INSERT ON `resource_bookings`
FOR EACH ROW
BEGIN
  DECLARE v_asset_status VARCHAR(50);
  DECLARE v_overlap_count INT;

  -- 1. Enforce availability rule: check if asset state is bookable
  SELECT `current_status` INTO v_asset_status FROM `assets` WHERE `id` = NEW.`resource_id`;
  IF v_asset_status IN ('Under Maintenance', 'Disposed', 'Lost') THEN
    SIGNAL SQLSTATE '45000' 
      SET MESSAGE_TEXT = 'Operation Denied: The requested resource is currently unavailable, under maintenance, or disposed.';
  END IF;

  -- 2. Enforce overlap rule: check for time overlaps on the same resource
  SELECT COUNT(*) INTO v_overlap_count 
  FROM `resource_bookings`
  WHERE `resource_id` = NEW.`resource_id`
    AND `booking_date` = NEW.`booking_date`
    -- Overlapping condition: A starts before B ends, and B starts before A ends
    AND `start_time` < NEW.`end_time`
    AND `end_time` > NEW.`start_time`
    -- Only active bookings block new bookings
    AND `status` IN ('Pending', 'Approved', 'Completed');

  IF v_overlap_count > 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Operation Denied: The requested booking timeslot overlaps with an existing pending/approved booking.';
  END IF;
END;
//

-- Trigger 2: Prevent booking overlaps on status updates/rescheduling (Update validation)
DROP TRIGGER IF EXISTS `trg_bookings_before_update`//
CREATE TRIGGER `trg_bookings_before_update`
BEFORE UPDATE ON `resource_bookings`
FOR EACH ROW
BEGIN
  DECLARE v_asset_status VARCHAR(50);
  DECLARE v_overlap_count INT;

  -- Verify availability on resource changes
  IF OLD.`resource_id` <> NEW.`resource_id` THEN
    SELECT `current_status` INTO v_asset_status FROM `assets` WHERE `id` = NEW.`resource_id`;
    IF v_asset_status IN ('Under Maintenance', 'Disposed', 'Lost') THEN
      SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Operation Denied: The requested resource is currently unavailable, under maintenance, or disposed.';
    END IF;
  END IF;

  -- Check overlaps on timeslot edits or status re-activations
  IF (OLD.`start_time` <> NEW.`start_time` 
      OR OLD.`end_time` <> NEW.`end_time` 
      OR OLD.`booking_date` <> NEW.`booking_date`
      OR (OLD.`status` IN ('Rejected', 'Cancelled') AND NEW.`status` IN ('Pending', 'Approved'))) 
      AND NEW.`status` IN ('Pending', 'Approved', 'Completed') 
  THEN
    SELECT COUNT(*) INTO v_overlap_count 
    FROM `resource_bookings`
    WHERE `resource_id` = NEW.`resource_id`
      AND `id` <> NEW.`id` -- Exclude self
      AND `booking_date` = NEW.`booking_date`
      AND `start_time` < NEW.`end_time`
      AND `end_time` > NEW.`start_time`
      AND `status` IN ('Pending', 'Approved', 'Completed');

    IF v_overlap_count > 0 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Operation Denied: The updated timeslot overlaps with an existing pending/approved booking.';
    END IF;
  END IF;
END;
//

-- Trigger 3: Automatically seed booking history log on new booking creation
DROP TRIGGER IF EXISTS `trg_bookings_after_insert`//
CREATE TRIGGER `trg_bookings_after_insert`
AFTER INSERT ON `resource_bookings`
FOR EACH ROW
BEGIN
  INSERT INTO `booking_history` (`booking_id`, `action`, `performed_by`, `remarks`)
  VALUES (NEW.`id`, 'Created', NEW.`employee_id`, 'New resource booking request submitted.');
END;
//

-- Trigger 4: Automatically seed booking history log on status adjustments
DROP TRIGGER IF EXISTS `trg_bookings_after_update`//
CREATE TRIGGER `trg_bookings_after_update`
AFTER UPDATE ON `resource_bookings`
FOR EACH ROW
BEGIN
  IF OLD.`status` <> NEW.`status` THEN
    INSERT INTO `booking_history` (`booking_id`, `action`, `performed_by`, `remarks`)
    VALUES (
      NEW.`id`, 
      NEW.`status`, 
      COALESCE(NEW.`approved_by`, NEW.`employee_id`), 
      CONCAT('Booking status changed from ', OLD.`status`, ' to ', NEW.`status`, '.')
    );
  END IF;
END;
//

DELIMITER ;


-- ============================================================================
-- SAMPLE DATA SEED STATEMENTS
-- ============================================================================

-- 1. Seed Resource Bookings
-- (Presumes Asset 1 (MacBook - allocated but available for timeslot booking if resource)
--  and Asset 4 (Desk Chair - available) represent bookable assets. Employee 3 is John Doe)
INSERT INTO `resource_bookings` (`id`, `resource_id`, `employee_id`, `booking_title`, `purpose`, `booking_date`, `start_time`, `end_time`, `status`, `approved_by`, `remarks`) VALUES
(1, 4, 3, 'Workspace Cube Reservation', 'HR Onboarding Session', '2026-07-15', '09:00:00', '12:00:00', 'Approved', 1, 'Approved by IT Admin.'),
(2, 4, 3, 'Workspace Cube Reservation - Session 2', 'Developer Team Sync', '2026-07-15', '14:00:00', '16:00:00', 'Pending', NULL, 'Awaiting approval.');

-- 2. Seed Maintenance Requests
-- John Doe (id=3) reports keyboard issue on MacBook Pro (id=1)
INSERT INTO `maintenance_requests` (`id`, `asset_id`, `employee_id`, `issue_title`, `issue_description`, `priority`, `status`, `requested_date`, `assigned_to`, `remarks`) VALUES
(1, 1, 3, 'MacBook Keyboard Double Typing', 'The spacebar and E keys double register typing. Needs cleaning or replacement.', 'Medium', 'Pending', '2026-07-10', NULL, 'Awaiting IT triage.');

-- 3. Seed Employee Requests
-- John requests Software Installation and Access
INSERT INTO `employee_requests` (`id`, `employee_id`, `request_type`, `title`, `description`, `status`, `request_date`) VALUES
(1, 3, 'Software Installation', 'Docker Desktop Business License', 'Requesting Docker Desktop license installation on MacBook MBP3MAX8829.', 'Pending', '2026-07-11'),
(2, 3, 'Access Request', 'GitLab Repository Access - Org Repos', 'Requesting developer permissions access to main repositories.', 'Approved', '2026-07-09');

-- 4. Seed Employee Notifications
INSERT INTO `employee_notifications` (`id`, `employee_id`, `title`, `message`, `notification_type`, `is_read`) VALUES
(1, 3, 'Booking Approved', 'Your booking request for Workspace Cube Reservation on 2026-07-15 is approved.', 'Booking', 0),
(2, 3, 'Welcome Notification', 'Welcome John Doe. Your employee profile configuration is complete.', 'Alert', 1);

-- Note: booking_history table is automatically seeded by triggers trg_bookings_after_insert and trg_bookings_after_update.
