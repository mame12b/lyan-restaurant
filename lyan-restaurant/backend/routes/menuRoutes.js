import express from 'express';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:branchId')
  .get(getMenuItems)
  .post(protect, addMenuItem);

router.route('/:id')
  .put(protect, updateMenuItem)
  .delete(protect, deleteMenuItem);

export default router;