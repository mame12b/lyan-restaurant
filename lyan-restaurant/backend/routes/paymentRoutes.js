import  express from 'express';
import  {
    getPayments,
    updatePayment,
    deletePayment,
    processPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// Create a new payment for a catering order
router.post('/', processPayment);

// Get all payments for catering orders
router.get('/', getPayments);

// Update a payment by ID
router.put('/:id', updatePayment);

// Delete a payment by ID
router.delete('/:id', deletePayment);

export default router;