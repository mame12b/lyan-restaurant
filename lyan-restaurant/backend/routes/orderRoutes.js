import express from "express";
import {  getOrders, getOrderById, updateOrder, deleteOrder} from "../controllers/orderController.js";

const router= express.Router();

router.get('/', getOrders); //Get All Orders
router.get('/:id', getOrderById); //get a single order
router.put('/:id', updateOrder); //Update order status
router.delete("/:id", deleteOrder); // Delete an order

export default router;