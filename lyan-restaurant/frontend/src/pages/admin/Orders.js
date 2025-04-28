import { useEffect, useState } from "react";
import { Container, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";


const Orders = ()=>{
    const [orders, setOrders] = useState([]);

    useEffect(() => {
    fetchOrders();
    }, []);

    const fetchOrders= async ()=>{
        try {
            const response = await axios.get("http://localhost:5000/api/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("error fetching orders", error);
        }
    };
    const updateOrderStatus = async (id, status)=>{
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}`, { orderStatus: status });
            fetchOrders();
        } catch (error) {
            console.error("error updating order", error)
        }
    };
    const deleteOrder = async(id) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${id}`);
            fetchOrders();
        } catch (error) {
            console.error("Error deleting order", error);
        }
    };
    return (
        <Container>
        <h2>Orders Management</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerContact}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>
                  <Select
                    value={order.orderStatus}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Canceled">Canceled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteOrder(order._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>

    );
};
 export default Orders;