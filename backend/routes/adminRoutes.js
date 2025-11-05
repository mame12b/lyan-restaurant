import express from 'express';
import { protect, restrictTo, admin } from '../middlewares/authMiddleware.js';
import { getUsers, getAdminDashboard, deleteUser } from '../controllers/adminController.js';
import { validateMongoId, validate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Apply to all admin routes
router.use(protect, restrictTo('admin'));

router.get('/users', getUsers);
router.get('/dashboard', getAdminDashboard);
router.delete(
	'/users/:id',
	protect,
	admin,
	validateMongoId('id', 'Invalid user identifier'),
	validate,
	deleteUser
);

export default router;
