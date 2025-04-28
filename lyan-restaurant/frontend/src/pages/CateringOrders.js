import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Container, Typography } from "@mui/material";

export const CateringOrders = () => {
    const [branches, setBranches] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [eventType, setEventType] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/branches");
                setBranches(response.data);
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };
        fetchBranches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/catering", 
        
                { branchId, eventType, date, time, guests, specialRequests },
                { headers: { Authorization: `Bearer ${token}` } }
         );
            alert("Catering Order Successfully Created!");
            navigate(`/menu/${branchId}`); // Redirect to Menu after successful submission
        } catch (error) {
            console.error("Error creating catering order:", error);
            alert("Error creating catering order.");
        }
    };

    return (
        <Container>
            <Typography variant="h4">Catering Order</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Branch</InputLabel>
                    <Select value={branchId} onChange={(e) => setBranchId(e.target.value)} required>
                        {branches.map((branch) => (
                            <MenuItem key={branch._id} value={branch._id}>{branch.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField fullWidth label="Event Type" value={eventType} onChange={(e) => setEventType(e.target.value)} required />
                <TextField fullWidth type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <TextField fullWidth type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                <TextField fullWidth type="number" label="Number of Guests" value={guests} onChange={(e) => setGuests(e.target.value)} required />
                <TextField fullWidth label="Special Requests" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
                <Button type="submit" variant="contained" color="primary">Submit Catering Order</Button>
            </form>
        </Container>
    );
};

export default CateringOrders;
