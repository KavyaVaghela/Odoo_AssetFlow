const db = require('../config/db');
const response = require('../utils/response');
const { sendMail } = require('../utils/mailer');
const bcrypt = require('bcryptjs');

class HODController {
  // ==========================================================================
  // 1. Dashboard API
  // ==========================================================================
  async getDashboard(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;

      // 1. Department Info
      const [deptRows] = await db.query(
        'SELECT * FROM departments WHERE id = ?',
        [deptId]
      );
      const departmentInfo = deptRows[0];

      // 2. Department Employees Count
      const [empCountRows] = await db.query(
        "SELECT COUNT(*) AS count FROM users WHERE department_id = ? AND status = 'Active'",
        [deptId]
      );

      // 3. Department Assets Count
      const [assetCountRows] = await db.query(
        'SELECT COUNT(*) AS count FROM assets WHERE department_id = ?',
        [deptId]
      );

      // 4. Booking Requests Pending Count
      const [pendingBookingsRows] = await db.query(
        "SELECT COUNT(*) AS count FROM resource_bookings rb JOIN assets a ON rb.resource_id = a.id WHERE a.department_id = ? AND rb.status = 'Pending'",
        [deptId]
      );

      // 5. Service Requests Pending Count
      const [pendingReqRows] = await db.query(
        "SELECT COUNT(*) AS count FROM employee_requests er JOIN users u ON er.employee_id = u.id WHERE u.department_id = ? AND er.status = 'Pending'",
        [deptId]
      );

      // 6. Maintenance Requests Pending Count
      const [pendingMaintRows] = await db.query(
        "SELECT COUNT(*) AS count FROM maintenance_requests mr JOIN assets a ON mr.asset_id = a.id WHERE a.department_id = ? AND mr.status = 'Pending'",
        [deptId]
      );

      const totalPendingApprovals = 
        pendingBookingsRows[0].count + 
        pendingReqRows[0].count + 
        pendingMaintRows[0].count;

      // 7. Today's Bookings
      const [todayBookings] = await db.query(
        `SELECT rb.*, u.first_name, u.last_name, a.asset_name 
         FROM resource_bookings rb 
         JOIN users u ON rb.employee_id = u.id 
         JOIN assets a ON rb.resource_id = a.id 
         WHERE a.department_id = ? AND rb.booking_date = CURDATE()`,
        [deptId]
      );

      // 8. Department Statistics (Asset counts grouped by status)
      const [stats] = await db.query(
        `SELECT current_status, COUNT(*) as count 
         FROM assets 
         WHERE department_id = ? 
         GROUP BY current_status`,
        [deptId]
      );

      // 9. Recent Activities (from HOD department's activity logs)
      const [recentActivities] = await db.query(
        `SELECT al.*, u.first_name, u.last_name 
         FROM activity_logs al 
         JOIN users u ON al.user_id = u.id 
         WHERE u.department_id = ? 
         ORDER BY al.created_at DESC 
         LIMIT 5`,
        [deptId]
      );

      // Assemble payload
      const dashboardData = {
        department: departmentInfo,
        stats: {
          employeeCount: empCountRows[0].count,
          assetCount: assetCountRows[0].count,
          pendingApprovals: totalPendingApprovals,
          todayBookingsCount: todayBookings.length,
          pendingMaintenanceCount: pendingMaintRows[0].count,
          statusDistribution: stats
        },
        todayBookings,
        recentActivities
      };

      return response.success(res, 'Dashboard metrics fetched successfully', dashboardData);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 2. Department Employees Directory
  // ==========================================================================
  async getEmployees(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const sql = `
        SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, 
               u.joining_date, u.status, u.profile_image, ds.designation_name,
               (SELECT COUNT(*) FROM asset_allocations WHERE employee_id = u.id AND allocation_status = 'Active') AS allocated_assets_count
        FROM users u
        LEFT JOIN designations ds ON u.designation_id = ds.id
        WHERE u.department_id = ?
        ORDER BY u.first_name ASC
      `;
      const [employees] = await db.query(sql, [deptId]);

      return response.success(res, 'Department employees fetched successfully', employees);
    } catch (err) {
      next(err);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const { id } = req.params;

      const sql = `
        SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, 
               u.joining_date, u.status, u.profile_image, ds.designation_name
        FROM users u
        LEFT JOIN designations ds ON u.designation_id = ds.id
        WHERE u.id = ? AND u.department_id = ?
      `;
      const [rows] = await db.query(sql, [id, deptId]);

      if (rows.length === 0) {
        return response.error(res, 'Employee not found in your department', 404);
      }

      return response.success(res, 'Employee details fetched successfully', rows[0]);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 3. Department Assets Inventory
  // ==========================================================================
  async getAssets(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const sql = `
        SELECT a.id, a.asset_code, a.asset_name, a.brand, a.model, a.current_status, 
               a.condition, a.location, a.asset_image, ac.category_name,
               (SELECT CONCAT(u.first_name, ' ', u.last_name) FROM asset_allocations aa JOIN users u ON aa.employee_id = u.id WHERE aa.asset_id = a.id AND aa.allocation_status = 'Active' LIMIT 1) AS holder,
               (SELECT aa.allocation_date FROM asset_allocations aa WHERE aa.asset_id = a.id AND aa.allocation_status = 'Active' LIMIT 1) AS allocation_date
        FROM assets a
        JOIN asset_categories ac ON a.asset_category_id = ac.id
        WHERE a.department_id = ?
        ORDER BY a.asset_code ASC
      `;
      const [assets] = await db.query(sql, [deptId]);

      return response.success(res, 'Department assets inventory fetched successfully', assets);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 4. Booking Approvals
  // ==========================================================================
  async getBookingRequests(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const sql = `
        SELECT rb.*, u.first_name, u.last_name, u.email AS employee_email, 
               a.asset_name, a.asset_code, a.current_status
        FROM resource_bookings rb
        JOIN users u ON rb.employee_id = u.id
        JOIN assets a ON rb.resource_id = a.id
        WHERE a.department_id = ?
        ORDER BY rb.created_at DESC
      `;
      const [bookings] = await db.query(sql, [deptId]);

      return response.success(res, 'Booking requests fetched successfully', bookings);
    } catch (err) {
      next(err);
    }
  }

  async approveBooking(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      // Find booking & assert HOD authority
      const [bookings] = await db.query(
        'SELECT rb.*, u.email, u.first_name, a.asset_name FROM resource_bookings rb JOIN users u ON rb.employee_id = u.id JOIN assets a ON rb.resource_id = a.id WHERE rb.id = ? AND a.department_id = ?',
        [id, deptId]
      );
      if (bookings.length === 0) {
        return response.error(res, 'Booking request not found or unauthorized', 404);
      }

      const booking = bookings[0];

      // Update booking status
      await db.query(
        "UPDATE resource_bookings SET status = 'Approved', approved_by = ?, remarks = ? WHERE id = ?",
        [hodId, remarks || null, id]
      );

      // Create notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Booking')",
        [booking.employee_id, 'Booking Approved', `Your booking slot for "${booking.asset_name}" has been approved by your HOD.`]
      );

      // Log activity
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Booking', 'Booking Approval', ?)",
        [hodId, `Approved booking ID ${id} for "${booking.asset_name}" requested by ${booking.first_name}`]
      );

      // Dispatch approval email
      await sendMail({
        to: booking.email,
        subject: `Booking Approved - ${booking.asset_name}`,
        html: `<p>Hello ${booking.first_name},</p>
               <p>Your HOD has approved your booking reservation slot for <strong>${booking.asset_name}</strong> on <strong>${booking.booking_date}</strong> (${booking.start_time} - ${booking.end_time}).</p>
               <p>Remarks: ${remarks || 'None'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Booking approved successfully');
    } catch (err) {
      next(err);
    }
  }

  async rejectBooking(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      // Find booking
      const [bookings] = await db.query(
        'SELECT rb.*, u.email, u.first_name, a.asset_name FROM resource_bookings rb JOIN users u ON rb.employee_id = u.id JOIN assets a ON rb.resource_id = a.id WHERE rb.id = ? AND a.department_id = ?',
        [id, deptId]
      );
      if (bookings.length === 0) {
        return response.error(res, 'Booking request not found or unauthorized', 404);
      }

      const booking = bookings[0];

      // Update status
      await db.query(
        "UPDATE resource_bookings SET status = 'Rejected', approved_by = ?, remarks = ? WHERE id = ?",
        [hodId, remarks || null, id]
      );

      // Create notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Booking')",
        [booking.employee_id, 'Booking Rejected', `Your booking slot for "${booking.asset_name}" has been rejected by HOD.`]
      );

      // Log activity
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Booking', 'Booking Rejection', ?)",
        [hodId, `Rejected booking ID ${id} for "${booking.asset_name}" requested by ${booking.first_name}`]
      );

      // Dispatch rejection email
      await sendMail({
        to: booking.email,
        subject: `Booking Rejected - ${booking.asset_name}`,
        html: `<p>Hello ${booking.first_name},</p>
               <p>Your HOD has declined your booking reservation slot for <strong>${booking.asset_name}</strong>.</p>
               <p>Remarks/Reason: ${remarks || 'No reason specified'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Booking rejected successfully');
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 5. Maintenance Approvals
  // ==========================================================================
  async getMaintenanceRequests(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const sql = `
        SELECT mr.*, u.first_name, u.last_name, u.email AS employee_email, 
               a.asset_name, a.asset_code,
               (SELECT CONCAT(first_name, ' ', last_name) FROM users WHERE id = mr.assigned_to) AS technician_name
        FROM maintenance_requests mr
        JOIN users u ON mr.employee_id = u.id
        JOIN assets a ON mr.asset_id = a.id
        WHERE a.department_id = ?
        ORDER BY mr.created_at DESC
      `;
      const [maintenance] = await db.query(sql, [deptId]);

      return response.success(res, 'Maintenance requests fetched successfully', maintenance);
    } catch (err) {
      next(err);
    }
  }

  async approveMaintenance(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      const [requests] = await db.query(
        'SELECT mr.*, u.email, u.first_name, a.asset_name FROM maintenance_requests mr JOIN users u ON mr.employee_id = u.id JOIN assets a ON mr.asset_id = a.id WHERE mr.id = ? AND a.department_id = ?',
        [id, deptId]
      );
      if (requests.length === 0) {
        return response.error(res, 'Maintenance request not found or unauthorized', 404);
      }

      const request = requests[0];

      // Update maintenance status and asset status
      await db.query(
        "UPDATE maintenance_requests SET status = 'Approved', remarks = ? WHERE id = ?",
        [remarks || null, id]
      );
      await db.query(
        "UPDATE assets SET current_status = 'Under Maintenance' WHERE id = ?",
        [request.asset_id]
      );

      // Create notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Maintenance')",
        [request.employee_id, 'Maintenance Approved', `Your maintenance ticket for "${request.asset_name}" was approved.`]
      );

      // Log activity
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Maintenance', 'Maintenance Approval', ?)",
        [hodId, `Approved maintenance request ID ${id} for "${request.asset_name}"`]
      );

      // Send email
      await sendMail({
        to: request.email,
        subject: `Maintenance Request Approved - ${request.asset_name}`,
        html: `<p>Hello ${request.first_name},</p>
               <p>Your maintenance ticket for <strong>${request.asset_name}</strong> was approved by your HOD. The asset status was updated to "Under Maintenance".</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Maintenance request approved');
    } catch (err) {
      next(err);
    }
  }

  async rejectMaintenance(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      const [requests] = await db.query(
        'SELECT mr.*, u.email, u.first_name, a.asset_name FROM maintenance_requests mr JOIN users u ON mr.employee_id = u.id JOIN assets a ON mr.asset_id = a.id WHERE mr.id = ? AND a.department_id = ?',
        [id, deptId]
      );
      if (requests.length === 0) {
        return response.error(res, 'Maintenance request not found or unauthorized', 404);
      }

      const request = requests[0];

      await db.query(
        "UPDATE maintenance_requests SET status = 'Rejected', remarks = ? WHERE id = ?",
        [remarks || null, id]
      );

      // Notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Maintenance')",
        [request.employee_id, 'Maintenance Rejected', `Your maintenance request for "${request.asset_name}" was rejected by HOD.`]
      );

      // Send email
      await sendMail({
        to: request.email,
        subject: `Maintenance Request Rejected - ${request.asset_name}`,
        html: `<p>Hello ${request.first_name},</p>
               <p>Your HOD has declined the maintenance request for <strong>${request.asset_name}</strong>.</p>
               <p>Reason: ${remarks || 'None specified'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Maintenance request rejected');
    } catch (err) {
      next(err);
    }
  }

  async assignMaintenance(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { assigned_to, remarks } = req.body; // Technician user ID

      // Assert HOD authority
      const [requests] = await db.query(
        'SELECT mr.*, a.asset_name FROM maintenance_requests mr JOIN assets a ON mr.asset_id = a.id WHERE mr.id = ? AND a.department_id = ?',
        [id, deptId]
      );
      if (requests.length === 0) {
        return response.error(res, 'Maintenance request not found or unauthorized', 404);
      }
      const request = requests[0];

      // Assert technician validity
      const [techs] = await db.query(
        'SELECT id, email, first_name FROM users WHERE id = ?',
        [assigned_to]
      );
      if (techs.length === 0) {
        return response.error(res, 'Selected technician user not found', 400);
      }
      const technician = techs[0];

      // Update maintenance
      await db.query(
        "UPDATE maintenance_requests SET status = 'Assigned', assigned_to = ?, remarks = ? WHERE id = ?",
        [assigned_to, remarks || null, id]
      );

      // Notifications
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Maintenance')",
        [request.employee_id, 'Technician Assigned', `Technician ${technician.first_name} was assigned to fix your "${request.asset_name}".`]
      );
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Maintenance')",
        [assigned_to, 'New Task Assigned', `You were assigned to maintenance ticket ID ${id} for "${request.asset_name}".`]
      );

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Maintenance', 'Maintenance Assignment', ?)",
        [hodId, `Assigned technician ${technician.first_name} to maintenance task ID ${id}`]
      );

      // Send emails
      await sendMail({
        to: technician.email,
        subject: `New Maintenance Task Assigned - Task ID: ${id}`,
        html: `<p>Hello ${technician.first_name},</p>
               <p>You have been assigned to fix <strong>${request.asset_name}</strong>.</p>
               <p>Task details: ${request.issue_description}</p>
               <p>Remarks: ${remarks || 'None'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Maintenance technician assigned successfully');
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 6. Employee Service Requests
  // ==========================================================================
  async getEmployeeRequests(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const sql = `
        SELECT er.*, u.first_name, u.last_name, u.email AS employee_email 
        FROM employee_requests er
        JOIN users u ON er.employee_id = u.id
        WHERE u.department_id = ?
        ORDER BY er.created_at DESC
      `;
      const [requests] = await db.query(sql, [deptId]);

      return response.success(res, 'Employee requests fetched successfully', requests);
    } catch (err) {
      next(err);
    }
  }

  async approveEmployeeRequest(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      const [requests] = await db.query(
        'SELECT er.*, u.email, u.first_name FROM employee_requests er JOIN users u ON er.employee_id = u.id WHERE er.id = ? AND u.department_id = ?',
        [id, deptId]
      );
      if (requests.length === 0) {
        return response.error(res, 'Service request not found or unauthorized', 404);
      }
      const request = requests[0];

      // Update request status
      await db.query(
        "UPDATE employee_requests SET status = 'Approved', approved_by = ?, remarks = ?, completed_date = CURDATE() WHERE id = ?",
        [hodId, remarks || null, id]
      );

      // Trigger notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Request')",
        [request.employee_id, 'Service Request Approved', `Your request for "${request.title}" has been approved.`]
      );

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Request', 'Employee Request Approval', ?)",
        [hodId, `Approved service request ID ${id} ("${request.title}") requested by ${request.first_name}`]
      );

      // Email
      await sendMail({
        to: request.email,
        subject: `Request Approved - ${request.title}`,
        html: `<p>Hello ${request.first_name},</p>
               <p>Your request for <strong>${request.title}</strong> of type <strong>${request.request_type}</strong> has been approved by HOD.</p>
               <p>Remarks: ${remarks || 'None'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Employee request approved successfully');
    } catch (err) {
      next(err);
    }
  }

  async rejectEmployeeRequest(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;
      const { id } = req.params;
      const { remarks } = req.body;

      const [requests] = await db.query(
        'SELECT er.*, u.email, u.first_name FROM employee_requests er JOIN users u ON er.employee_id = u.id WHERE er.id = ? AND u.department_id = ?',
        [id, deptId]
      );
      if (requests.length === 0) {
        return response.error(res, 'Service request not found or unauthorized', 404);
      }
      const request = requests[0];

      // Update status
      await db.query(
        "UPDATE employee_requests SET status = 'Rejected', approved_by = ?, remarks = ?, completed_date = CURDATE() WHERE id = ?",
        [hodId, remarks || null, id]
      );

      // Notification
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, 'Request')",
        [request.employee_id, 'Service Request Rejected', `Your request for "${request.title}" was rejected.`]
      );

      // Email
      await sendMail({
        to: request.email,
        subject: `Request Rejected - ${request.title}`,
        html: `<p>Hello ${request.first_name},</p>
               <p>Your request for <strong>${request.title}</strong> has been rejected by HOD.</p>
               <p>Remarks: ${remarks || 'None'}</p>
               <p>Sincerely,<br/>AssetFlow Team</p>`
      });

      return response.success(res, 'Employee request rejected');
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 7. Department Resources (Bookable Assets)
  // ==========================================================================
  async getResources(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      
      // Returns assets in HOD department that can act as resource bookings (e.g. labs, screens, projectors)
      // Presumed Electronics or Equipments categories
      const [resources] = await db.query(
        `SELECT id, asset_code, asset_name, brand, model, current_status, condition, location 
         FROM assets 
         WHERE department_id = ? AND current_status IN ('Available', 'Allocated')`,
        [deptId]
      );

      return response.success(res, 'Department bookable resources fetched successfully', resources);
    } catch (err) {
      next(err);
    }
  }

  async getResourceBookings(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      const [bookings] = await db.query(
        `SELECT rb.*, u.first_name, u.last_name, a.asset_name, a.asset_code 
         FROM resource_bookings rb
         JOIN users u ON rb.employee_id = u.id
         JOIN assets a ON rb.resource_id = a.id
         WHERE a.department_id = ?
         ORDER BY rb.booking_date DESC, rb.start_time DESC`,
        [deptId]
      );

      return response.success(res, 'Department resource bookings fetched successfully', bookings);
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 8. Department Calendar
  // ==========================================================================
  async getCalendarEvents(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;

      // Returns all active bookings for calendar rendering
      const [events] = await db.query(
        `SELECT rb.id, rb.booking_title, rb.purpose, rb.booking_date, rb.start_time, 
                rb.end_time, rb.status, a.asset_name as resource_name,
                CONCAT(u.first_name, ' ', u.last_name) as employee_name
         FROM resource_bookings rb
         JOIN assets a ON rb.resource_id = a.id
         JOIN users u ON rb.employee_id = u.id
         WHERE a.department_id = ? AND rb.status IN ('Approved', 'Pending', 'Completed')`,
        [deptId]
      );

      return response.success(res, 'Calendar events fetched successfully', events);
    } catch (err) {
      next(err);
    }
  }

  async createCalendarEvent(req, res, next) {
    try {
      const hodId = req.user.id;
      const { resource_id, booking_title, purpose, booking_date, start_time, end_time } = req.body;

      // Note: Triggers on resource_bookings handle availability & timeslot overlaps automatically
      const [result] = await db.query(
        `INSERT INTO resource_bookings (resource_id, employee_id, booking_title, purpose, booking_date, start_time, end_time, status, approved_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Approved', ?)`,
        [resource_id, hodId, booking_title, purpose || null, booking_date, start_time, end_time, hodId]
      );

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Booking', 'Calendar Update', ?)",
        [hodId, `Created and auto-approved booking slot ID ${result.insertId}: "${booking_title}"`]
      );

      return response.success(res, 'Calendar booking reservation created successfully', { id: result.insertId }, 201);
    } catch (err) {
      if (err.sqlState === '45000') {
        return response.error(res, err.message, 400);
      }
      next(err);
    }
  }

  async updateCalendarEvent(req, res, next) {
    try {
      const hodId = req.user.id;
      const { id } = req.params;
      const { booking_title, purpose, booking_date, start_time, end_time, status } = req.body;

      await db.query(
        `UPDATE resource_bookings 
         SET booking_title = ?, purpose = ?, booking_date = ?, start_time = ?, end_time = ?, status = ?, approved_by = ?
         WHERE id = ?`,
        [booking_title, purpose || null, booking_date, start_time, end_time, status || 'Approved', hodId, id]
      );

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Booking', 'Calendar Update', ?)",
        [hodId, `Updated calendar booking ID ${id}: "${booking_title}"`]
      );

      return response.success(res, 'Calendar booking updated successfully');
    } catch (err) {
      if (err.sqlState === '45000') {
        return response.error(res, err.message, 400);
      }
      next(err);
    }
  }

  async deleteCalendarEvent(req, res, next) {
    try {
      const hodId = req.user.id;
      const { id } = req.params;

      await db.query('DELETE FROM resource_bookings WHERE id = ?', [id]);

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Booking', 'Calendar Update', ?)",
        [hodId, `Cancelled and deleted calendar booking ID ${id}`]
      );

      return response.success(res, 'Calendar booking deleted/cancelled successfully');
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 9. Reports
  // ==========================================================================
  async getReports(req, res, next) {
    try {
      const deptId = req.user.hodDepartmentId;
      const hodId = req.user.id;

      // 1. Asset report
      const [assets] = await db.query(
        `SELECT id, asset_code, asset_name, brand, model, purchase_cost, current_status, \`condition\` 
         FROM assets 
         WHERE department_id = ?`,
        [deptId]
      );

      // 2. Employee report
      const [employees] = await db.query(
        `SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.status, u.joining_date,
                (SELECT COUNT(*) FROM asset_allocations WHERE employee_id = u.id AND allocation_status = 'Active') as assets_held
         FROM users u
         WHERE u.department_id = ?`,
        [deptId]
      );

      // 3. Maintenance report
      const [maintenance] = await db.query(
        `SELECT mr.id, a.asset_name, a.asset_code, mr.issue_title, mr.priority, mr.status, mr.requested_date, mr.completed_date
         FROM maintenance_requests mr
         JOIN assets a ON mr.asset_id = a.id
         WHERE a.department_id = ?`,
        [deptId]
      );

      // 4. Booking report
      const [bookings] = await db.query(
        `SELECT rb.id, a.asset_name, CONCAT(u.first_name, ' ', u.last_name) as employee, rb.booking_date, rb.start_time, rb.end_time, rb.status
         FROM resource_bookings rb
         JOIN assets a ON rb.resource_id = a.id
         JOIN users u ON rb.employee_id = u.id
         WHERE a.department_id = ?`,
        [deptId]
      );

      // Audit logs
      await db.query(
        "INSERT INTO activity_logs (user_id, module, action, description) VALUES (?, 'Report', 'Report Generation', ?)",
        [hodId, `Generated department report exports for HOD department ID ${deptId}`]
      );

      return response.success(res, 'Reports generated successfully', {
        assets,
        employees,
        maintenance,
        bookings
      });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 10. Notifications
  // ==========================================================================
  async getNotifications(req, res, next) {
    try {
      const hodId = req.user.id;
      const [notifications] = await db.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
        [hodId]
      );
      return response.success(res, 'Notifications list fetched successfully', notifications);
    } catch (err) {
      next(err);
    }
  }

  async readNotification(req, res, next) {
    try {
      const hodId = req.user.id;
      const { id } = req.params;

      await db.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [id, hodId]
      );

      return response.success(res, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  // ==========================================================================
  // 11. Profile Settings
  // ==========================================================================
  async getProfile(req, res, next) {
    try {
      const hodId = req.user.id;
      
      const sql = `
        SELECT u.id, u.employee_code, u.first_name, u.last_name, u.email, u.phone, 
               u.profile_image, u.joining_date, u.status, d.department_name, ds.designation_name
        FROM users u
        LEFT JOIN departments d ON u.department_id = d.id
        LEFT JOIN designations ds ON u.designation_id = ds.id
        WHERE u.id = ?
      `;
      const [rows] = await db.query(sql, [hodId]);
      
      return response.success(res, 'HOD profile details fetched successfully', rows[0]);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const hodId = req.user.id;
      const { phone, profile_image, password } = req.body;

      const updates = [];
      const params = [];

      if (phone) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (profile_image) {
        updates.push('profile_image = ?');
        params.push(profile_image);
      }
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        updates.push('password_hash = ?');
        params.push(hash);
      }

      if (updates.length === 0) {
        return response.error(res, 'No update parameters provided', 400);
      }

      params.push(hodId);
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await db.query(sql, params);

      return response.success(res, 'HOD profile settings updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new HODController();
