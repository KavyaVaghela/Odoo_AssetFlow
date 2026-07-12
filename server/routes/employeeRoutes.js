import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validateResult, idParamValidation, bookingValidation, maintenanceValidation, requestValidation, profileValidation } from '../middlewares/employeeValidator.js';

// Controllers
import { getDashboardSummary, getProfile, updateProfile } from '../controllers/employeeDashboardController.js';
import { getMyAssets, getMyBookings, createBooking, updateBooking, deleteBooking, getMyMaintenanceRequests, createMaintenanceRequest, updateMaintenanceRequest, getMyRequests, createRequest, updateRequest, deleteRequest } from '../controllers/employeeAssetController.js';
import { getMyNotifications, markNotificationRead } from '../controllers/employeeNotificationController.js';

const router = express.Router();

// Protect all employee routes
router.use(protect);
// Ensure only authenticated users with at least 'Employee' role can access
// Note: You can customize authorizeRoles to allow specific roles if they also share this dashboard, e.g., authorizeRoles('Employee', 'Asset Manager', 'Department Head')
router.use(authorizeRoles('Employee', 'Asset Manager', 'Department Head', 'Admin'));

// --- Dashboard & Profile ---
router.get('/dashboard', getDashboardSummary);
router.get('/profile', getProfile);
router.put('/profile', upload.single('profile_image'), profileValidation, validateResult, updateProfile);

// --- My Assets ---
router.get('/assets', getMyAssets);

// --- Resource Bookings ---
router.get('/bookings', getMyBookings);
router.post('/book-resource', bookingValidation, validateResult, createBooking);
router.put('/booking/:id', [...idParamValidation, ...bookingValidation], validateResult, updateBooking);
router.delete('/booking/:id', idParamValidation, validateResult, deleteBooking);

// --- Maintenance Requests ---
router.get('/maintenance', getMyMaintenanceRequests);
router.post('/maintenance', maintenanceValidation, validateResult, createMaintenanceRequest);
router.put('/maintenance/:id', [...idParamValidation, ...maintenanceValidation], validateResult, updateMaintenanceRequest);

// --- Employee Requests ---
router.get('/request', getMyRequests);
router.post('/request', requestValidation, validateResult, createRequest);
router.put('/request/:id', [...idParamValidation, ...requestValidation], validateResult, updateRequest);
router.delete('/request/:id', idParamValidation, validateResult, deleteRequest);

// --- Notifications ---
router.get('/notifications', getMyNotifications);
router.put('/notifications/read/:id', idParamValidation, validateResult, markNotificationRead);

export default router;
