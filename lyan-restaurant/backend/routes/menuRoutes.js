// import express from 'express';
// import {
//     addMenuItem,
//     getMenuItems,
//     updateMenuItem,
//     deleteMenuItem,
    
// } from '../controllers/menuController.js';
// import { protect } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// router.post('/',protect, addMenuItem);
// router.get('/:branchId', getMenuItems);
// router.put('/:id', updateMenuItem);
// router.delete('/:id', deleteMenuItem);

// export default router;

import express from 'express';
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:branchId')
  .get(getMenuItems)
  .post(protect, restrictTo('admin', 'manager'), addMenuItem);
router.route('/:id')
  .patch(protect, restrictTo('admin', 'manager'), updateMenuItem)
  .delete(protect, restrictTo('admin', 'manager'), deleteMenuItem);

export default router;