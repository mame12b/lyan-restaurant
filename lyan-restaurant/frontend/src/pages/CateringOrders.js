import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TextField, Button, Select, MenuItem, FormControl, 
  InputLabel, Container, Typography, Grid, 
  CircularProgress, Alert, Box 
} from "@mui/material";

// Predefined event types
const eventTypes = [
  'Wedding Reception',
  'Corporate Event',
  'Birthday Party',
  'Graduation Celebration',
  'Anniversary Party',
  'Baby Shower',
  'Other'
];

export const CateringOrders = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        branchId: '',
        eventType: '',
        date: '',
        time: '',
        guests: '',
        specialRequests: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/branches");
                setBranches(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching branches:", error);
                setError('Failed to load branch information');
                setLoading(false);
            }
        };
        fetchBranches();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/catering", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Catering Order Successfully Created!");
            navigate(`/menu/${formData.branchId}`);
        } catch (error) {
            console.error("Error creating catering order:", error);
            alert(error.response?.data?.message || "Error creating catering order.");
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Catering Order
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Select Branch</InputLabel>
                    <Select
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleChange}
                        label="Select Branch"
                        required
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch._id} value={branch._id}>
                                {branch.name} - {branch.address}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        label="Event Type"
                        required
                    >
                        {eventTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Event Date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Event Time"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    label="Number of Guests"
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                    inputProps={{ min: 1 }}
                    required
                />

                <TextField
                    fullWidth
                    label="Special Requests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ mb: 3 }}
                />

                <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                    sx={{ py: 2, px: 4, fontSize: '1.1rem' }}
                >
                    Submit Catering Order
                </Button>
            </Box>
        </Container>
    );
};

export default CateringOrders;