import express from 'express';
import {
    addMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    
} from '../controllers/menuController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',protect, addMenuItem);
router.get('/:branchId', getMenuItems);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;