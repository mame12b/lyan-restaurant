import  express from 'express';
import {
    createReservation,
    getUserReservations,
    updateReservation,
    deleteReservation,

} from '../controllers/reservationController.js';
import {  protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new reservation
router.post('/',protect, createReservation);

// Get all reservations for a specific restaurant
router.get('/user', protect, getUserReservations);

// Update a reservation by ID
router.put('/:id', updateReservation);

// Delete a reservation by ID
router.delete('/:id', deleteReservation);

export default router;