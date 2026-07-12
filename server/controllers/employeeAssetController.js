import pool from '../config/database.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { logActivity } from '../services/activityLogService.js';
import { createNotification } from '../services/notificationService.js';
import { 
  sendBookingApprovedEmail, 
  sendBookingRejectedEmail, 
  sendMaintenanceApprovedEmail, 
  sendMaintenanceCompletedEmail, 
  sendAssetAssignedEmail, 
  sendAssetReturnedEmail 
} from '../services/emailService.js';

// --- My Assets ---

export const getMyAssets = async (req, res, next) => {
  try {
    const [assets] = await pool.query(
      `SELECT a.id as asset_id, a.asset_code, a.asset_name, a.brand, a.model, a.qr_code, a.asset_image, a.current_status as asset_status, a.condition, 
              ac.category_name, 
              aa.id as allocation_id, aa.allocation_date, aa.expected_return_date, aa.allocation_status, aa.remarks
       FROM asset_allocations aa
       JOIN assets a ON aa.asset_id = a.id
       LEFT JOIN asset_categories ac ON a.asset_category_id = ac.id
       WHERE aa.employee_id = ? AND aa.allocation_status = 'Active'`,
      [req.user.id]
    );

    return successResponse(res, 'Allocated assets retrieved successfully', assets);
  } catch (error) {
    next(error);
  }
};

// --- Resource Bookings ---

export const getMyBookings = async (req, res, next) => {
  try {
    const [bookings] = await pool.query(
      `SELECT rb.*, r.resource_name, r.resource_type, r.location 
       FROM resource_bookings rb
       LEFT JOIN resources r ON rb.resource_id = r.id
       WHERE rb.employee_id = ?
       ORDER BY rb.booking_date DESC, rb.start_time DESC`,
      [req.user.id]
    );
    return successResponse(res, 'Bookings retrieved successfully', bookings);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { resource_id, booking_title, purpose, booking_date, start_time, end_time } = req.body;
    const employee_id = req.user.id;

    // Validate conflict
    const [conflicts] = await pool.query(
      `SELECT id FROM resource_bookings 
       WHERE resource_id = ? AND booking_date = ? 
       AND status IN ('Pending', 'Approved') 
       AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?))`,
      [resource_id, booking_date, end_time, start_time, end_time, start_time, start_time, end_time]
    );

    if (conflicts.length > 0) {
      return errorResponse(res, 'Resource is already booked during this time slot', [], 409);
    }

    const [result] = await pool.query(
      `INSERT INTO resource_bookings (resource_id, employee_id, booking_title, purpose, booking_date, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [resource_id, employee_id, booking_title, purpose, booking_date, start_time, end_time]
    );

    await logActivity(employee_id, 'Booking', 'Create Booking', `Requested booking for resource ${resource_id}`, req.ip);
    
    // Notify Admin/Manager (dummy user_id 1 for now if needed, or broadcast)
    // await createNotification(1, 'New Booking Request', `Employee requested booking: ${booking_title}`);

    return successResponse(res, 'Booking created successfully', { booking_id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { booking_title, purpose, booking_date, start_time, end_time } = req.body;
    
    // Check ownership and status
    const [existing] = await pool.query('SELECT status FROM resource_bookings WHERE id = ? AND employee_id = ?', [id, req.user.id]);
    if (existing.length === 0) return errorResponse(res, 'Booking not found or unauthorized', [], 404);
    if (existing[0].status !== 'Pending') return errorResponse(res, 'Only pending bookings can be updated', [], 400);

    await pool.query(
      `UPDATE resource_bookings SET booking_title = ?, purpose = ?, booking_date = ?, start_time = ?, end_time = ? WHERE id = ?`,
      [booking_title, purpose, booking_date, start_time, end_time, id]
    );

    await logActivity(req.user.id, 'Booking', 'Update Booking', `Updated booking ID ${id}`, req.ip);

    return successResponse(res, 'Booking updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [existing] = await pool.query('SELECT status FROM resource_bookings WHERE id = ? AND employee_id = ?', [id, req.user.id]);
    if (existing.length === 0) return errorResponse(res, 'Booking not found or unauthorized', [], 404);
    if (existing[0].status !== 'Pending') return errorResponse(res, 'Only pending bookings can be cancelled', [], 400);

    await pool.query('DELETE FROM resource_bookings WHERE id = ?', [id]);
    await logActivity(req.user.id, 'Booking', 'Cancel Booking', `Cancelled booking ID ${id}`, req.ip);

    return successResponse(res, 'Booking cancelled successfully');
  } catch (error) {
    next(error);
  }
};

// --- Maintenance Requests ---

export const getMyMaintenanceRequests = async (req, res, next) => {
  try {
    const [requests] = await pool.query(
      `SELECT mr.*, a.asset_name, a.asset_code 
       FROM maintenance_requests mr
       JOIN assets a ON mr.asset_id = a.id
       WHERE mr.employee_id = ?
       ORDER BY mr.created_at DESC`,
      [req.user.id]
    );
    return successResponse(res, 'Maintenance requests retrieved successfully', requests);
  } catch (error) {
    next(error);
  }
};

export const createMaintenanceRequest = async (req, res, next) => {
  try {
    const { asset_id, issue_title, issue_description, priority } = req.body;
    
    // Verify asset is allocated to user
    const [allocation] = await pool.query(
      'SELECT id FROM asset_allocations WHERE asset_id = ? AND employee_id = ? AND allocation_status = "Active"',
      [asset_id, req.user.id]
    );
    if (allocation.length === 0) return errorResponse(res, 'You can only request maintenance for currently assigned assets.', [], 403);

    const [result] = await pool.query(
      `INSERT INTO maintenance_requests (asset_id, employee_id, issue_title, issue_description, priority, status, requested_date) 
       VALUES (?, ?, ?, ?, ?, 'Pending', CURDATE())`,
      [asset_id, req.user.id, issue_title, issue_description, priority]
    );

    // Update asset status
    await pool.query('UPDATE assets SET current_status = "Under Maintenance" WHERE id = ?', [asset_id]);

    await logActivity(req.user.id, 'Maintenance', 'Create Maintenance', `Requested maintenance for asset ${asset_id}`, req.ip);

    return successResponse(res, 'Maintenance request submitted successfully', { request_id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateMaintenanceRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { issue_title, issue_description, priority } = req.body;

    const [existing] = await pool.query('SELECT status FROM maintenance_requests WHERE id = ? AND employee_id = ?', [id, req.user.id]);
    if (existing.length === 0) return errorResponse(res, 'Request not found or unauthorized', [], 404);
    if (existing[0].status !== 'Pending') return errorResponse(res, 'Only pending requests can be modified', [], 400);

    await pool.query(
      `UPDATE maintenance_requests SET issue_title = ?, issue_description = ?, priority = ? WHERE id = ?`,
      [issue_title, issue_description, priority, id]
    );

    await logActivity(req.user.id, 'Maintenance', 'Update Maintenance', `Updated maintenance request ID ${id}`, req.ip);

    return successResponse(res, 'Maintenance request updated successfully');
  } catch (error) {
    next(error);
  }
};

// --- Employee Requests ---

export const getMyRequests = async (req, res, next) => {
  try {
    const [requests] = await pool.query(
      `SELECT * FROM employee_requests WHERE employee_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    return successResponse(res, 'Employee requests retrieved successfully', requests);
  } catch (error) {
    next(error);
  }
};

export const createRequest = async (req, res, next) => {
  try {
    const { request_type, title, description } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO employee_requests (employee_id, request_type, title, description, status, request_date) 
       VALUES (?, ?, ?, ?, 'Pending', CURDATE())`,
      [req.user.id, request_type, title, description]
    );

    await logActivity(req.user.id, 'Request', 'Submit Request', `Submitted new ${request_type} request`, req.ip);

    return successResponse(res, 'Request submitted successfully', { request_id: result.insertId }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { request_type, title, description } = req.body;

    const [existing] = await pool.query('SELECT status FROM employee_requests WHERE id = ? AND employee_id = ?', [id, req.user.id]);
    if (existing.length === 0) return errorResponse(res, 'Request not found or unauthorized', [], 404);
    if (existing[0].status !== 'Pending') return errorResponse(res, 'Only pending requests can be modified', [], 400);

    await pool.query(
      `UPDATE employee_requests SET request_type = ?, title = ?, description = ? WHERE id = ?`,
      [request_type, title, description, id]
    );

    await logActivity(req.user.id, 'Request', 'Update Request', `Updated request ID ${id}`, req.ip);

    return successResponse(res, 'Request updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [existing] = await pool.query('SELECT status FROM employee_requests WHERE id = ? AND employee_id = ?', [id, req.user.id]);
    if (existing.length === 0) return errorResponse(res, 'Request not found or unauthorized', [], 404);
    if (existing[0].status !== 'Pending') return errorResponse(res, 'Only pending requests can be cancelled', [], 400);

    await pool.query('DELETE FROM employee_requests WHERE id = ?', [id]);
    await logActivity(req.user.id, 'Request', 'Cancel Request', `Cancelled request ID ${id}`, req.ip);

    return successResponse(res, 'Request cancelled successfully');
  } catch (error) {
    next(error);
  }
};
