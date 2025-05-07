import { useEffect, useState } from "react";
import { 
  Container, Table, TableHead, TableRow, TableCell, 
  TableBody, Button, Select, MenuItem, TableContainer,
  Paper, CircularProgress, Typography, Alert,Box
} from "@mui/material";
import BackButton from '../../components/BackButton';
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      setError("Failed to fetch orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { orderStatus: status });
      setSuccess("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      setError("Error updating order status: " + error.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`);
      setSuccess("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      setError("Error deleting order: " + error.message);
    }
  };

  const handleCloseAlert = () => {
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (

      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
     <Box sx={{ 
    display: 'flex',
    justifyContent: 'flex-end', // or 'flex-start'
    p: 2
  }}>
    <BackButton />
  </Box>

    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Orders Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box sx={{ textAlign: 'left', p: 2 }}>
</Box>

      <TableContainer component={Paper}>
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
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1">No orders found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerContact}</TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>{order.paymentStatus}</TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Confirmed">Confirmed</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Canceled">Canceled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => {
                        if(window.confirm("Are you sure you want to delete this order?")) {
                          deleteOrder(order._id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
};

export default Orders;