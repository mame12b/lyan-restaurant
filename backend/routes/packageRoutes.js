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
import {
  validatePackageCreation,
  validatePackageUpdate,
  validateMongoId,
  validatePackageQuery,
  validate
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', [...validatePackageQuery, validate], getPackages);
router.get('/featured', getFeaturedPackages);
router.get('/:id', validateMongoId(), validate, getPackageById);

// Admin routes
router.post('/', protect, admin, ...validatePackageCreation, validate, createPackage);
router.put(
  '/:id',
  protect,
  admin,
  validateMongoId(),
  ...validatePackageUpdate,
  validate,
  updatePackage
);
router.delete('/:id', protect, admin, validateMongoId(), validate, deletePackage);
router.patch(
  '/:id/toggle-active',
  protect,
  admin,
  validateMongoId(),
  validate,
  togglePackageActive
);

export default router;
