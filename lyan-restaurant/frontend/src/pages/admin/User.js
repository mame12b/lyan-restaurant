import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer,TableRow, Paper,Button,TableHead } from "@mui/material";
import axios from "axios";

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("authToken"); // get auth token
            const response = await axios.get("http://localhost:5000/api/admin/user", {
                headers: {Authorization: `Bearer ${token}`}, //pass token in handlers
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users", error);
            setError('failed to fetch users');
            setLoading(false);
        }
    };
fetchUsers();
}, []);

return(

    <Container>
    <Typography variant="h4" gutterBottom>
        User Management
    </Typography>
    {loading && <Typography>Loading users...</Typography>}
    {error && <Typography color="error">{error}</Typography>}
    {!loading && !error && (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user._id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary">Edit</Button>
                                <Button variant="contained" color="error" style={{ marginLeft: "10px" }}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )}
</Container>

);
};
export default User;