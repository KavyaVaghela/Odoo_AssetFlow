const express = require('express');
const router = express.Router();
const hodController = require('../controllers/hodController');
const verifyHOD = require('../middleware/hodAuth');
const { updateProfile, bookingSlot, assignTechnician } = require('../validators/hodValidator');

// Apply verifyHOD middleware to all endpoints under /api/hod
router.use(verifyHOD);

// 1. Dashboard
router.get('/dashboard', hodController.getDashboard);

// 2. Department Employees
router.get('/employees', hodController.getEmployees);
router.get('/employees/:id', hodController.getEmployeeById);

// 3. Department Assets
router.get('/assets', hodController.getAssets);

// 4. Booking Approvals
router.get('/booking-requests', hodController.getBookingRequests);
router.put('/booking/:id/approve', hodController.approveBooking);
router.put('/booking/:id/reject', hodController.rejectBooking);

// 5. Maintenance Approvals
router.get('/maintenance', hodController.getMaintenanceRequests);
router.put('/maintenance/:id/approve', hodController.approveMaintenance);
router.put('/maintenance/:id/reject', hodController.rejectMaintenance);
router.put('/maintenance/:id/assign', assignTechnician, hodController.assignMaintenance);

// 6. Employee Requests (Service requests)
router.get('/employee-requests', hodController.getEmployeeRequests);
router.put('/request/:id/approve', hodController.approveEmployeeRequest);
router.put('/request/:id/reject', hodController.rejectEmployeeRequest);

// 7. Department Resources (Bookable Assets)
router.get('/resources', hodController.getResources);
router.get('/resource-bookings', hodController.getResourceBookings);

// 8. Department Calendar
router.get('/calendar', hodController.getCalendarEvents);
router.post('/calendar', bookingSlot, hodController.createCalendarEvent);
router.put('/calendar/:id', bookingSlot, hodController.updateCalendarEvent);
router.delete('/calendar/:id', hodController.deleteCalendarEvent);

// 9. Reports
router.get('/reports', hodController.getReports);

// 10. Notifications
router.get('/notifications', hodController.getNotifications);
router.put('/notifications/read/:id', hodController.readNotification);

// 11. Profile Settings
router.get('/profile', hodController.getProfile);
router.put('/profile', updateProfile, hodController.updateProfile);

module.exports = router;
