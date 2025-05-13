import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableRow, Paper, Button, TableHead,
  CircularProgress, Alert, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import axios from "axios";
import BackButton from "../../components/BackButton";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [deleteUserId, setDeleteUserId] = useState(null);

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle backend response structure
        setUsers(data.data?.users || data.users || []);
        setError("");
      } catch (error) {
        console.error("Fetch Error:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });
        setError(error.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
      try {
        const token = localStorage.getItem("authToken");
       const response = await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
         }
        });
        if (response.data.success) {
            setSuccess(response.data.message);
            setUsers(prev => prev.filter(user => user._id !== userId))
        }
     
        // Refresh user list
        //await fetchUsers();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to delete user");
        console.error('Delete Error:', {
          status: error.response?.status,
          data: error.response?.data
        });
      } finally {
        setDeleteUserId(null);
      
      }
    };

    return (
        <Container sx={{ py: 4 }}>
            <BackButton />
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                User Management
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body1">No users found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="contained" 
                                                color="error"
                                                onClick={() => setDeleteUserId(user._id)}
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
            )}

            <Dialog
                open={Boolean(deleteUserId)}
                onClose={() => setDeleteUserId(null)}
            >
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteUserId(null)}>Cancel</Button>
                    <Button 
                        onClick={() => handleDeleteUser(deleteUserId)}
                        color="error"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Users;