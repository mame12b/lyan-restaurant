// import  express from 'express';
// import {
//     createReservation,
//     getUserReservations,
//     updateReservation,
//     deleteReservation,

// } from '../controllers/reservationController.js';
// import {  protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // Create a new reservation
// router.post('/api/reservations',protect, createReservation);

// // Get all reservations for a specific restaurant
// router.get('/api/reservations', protect, getUserReservations);

// // Update a reservation by ID
// router.put('/:id', updateReservation);

// // Delete a reservation by ID
// router.delete('/:id', deleteReservation);

// export default router;

// In your routes file
import express from 'express'
import { protect } from "../middlewares/authMiddleware.js";
import { 
    createReservation,
    getUserReservations,
    updateReservation,
    deleteReservation
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/", protect, getUserReservations);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

export default router;