import express from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageActive,
  getFeaturedPackages
} from '../controllers/packageController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/:id', getPackageById);

// Admin routes
router.post('/', protect, admin, createPackage);
router.put('/:id', protect, admin, updatePackage);
router.delete('/:id', protect, admin, deletePackage);
router.patch('/:id/toggle-active', protect, admin, togglePackageActive);

export default router;
