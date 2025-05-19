// // routes/menuRoutes.js
// import express from 'express';
// import { 
//   getMenu,
//   addMenu,
//   updateMenu,
//   deleteMenu
// } from '../controllers/menuController.js';

// const router = express.Router();

// router.get('/menu', getMenu);
// router.post('/branches/:branchId/menu', addMenu);
// router.put('/menu/:id', updateMenu);
// router.delete('/menu/:id', deleteMenu);

// export default router;


// import express from 'express';
// import {
//   getMenu,
//   addMenu,
//   updateMenu,
//   deleteMenu
// } from '../controllers/menuController.js';

// const router = express.Router();

// // Get all menu items with optional filtering
// router.get('/api/menu', getMenu);

// // Add a new menu item to a specific branch
// router.post('/api/menu', addMenu);

// // Update a specific menu item (requires branchId from controller)
// router.put('/api/menu/:id', updateMenu);

// // Delete a specific menu item
// router.delete('/api/menu/:id', deleteMenu);

// export default router;

import express from 'express';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getMenu);

// Admin protected routes
router.route('/')
  .post(createMenuItem);

router.route('/:id')
  .put(updateMenuItem)
  .delete(deleteMenuItem);

export default router;