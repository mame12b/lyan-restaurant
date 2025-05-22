import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  TextField, Button, Select, MenuItem, FormControl, 
  InputLabel, Container, Typography, Grid, Box 
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
    const [formData, setFormData] = useState({
        eventType: '',
        date: '',
        time: '',
        guests: '',
        specialRequests: ''
    });
    const navigate = useNavigate();

    useEffect(() =>{
       const token= localStorage.getItem('authToken');
       if (!token) {
        navigate('/login');
    }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

const handleSubmit = async (e) => {
  e.preventDefault();

   const token = localStorage.getItem("authToken");
   //check the authentication  before submission 
   if (!token) {
    alert("Please login to book catering.");
    navigate('/login');
    return;
   }

  try {

    // Create payload with corrected data
    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString(), 
      guests: Number(formData.guests),
    };

    // Send payload instead of formData
    await axios.post("http://localhost:5000/api/catering", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Catering Order Successfully Created!");
    navigate("/menu");
  } catch (error) {
    console.error("Error creating catering order:", error);
    alert(error.response?.data?.message || "Error creating catering order.");
  }
};


    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Catering Order
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                            inputProps = {{
                                //force ISO format (YYYY-MM-DD)
                                min: new Date().toISOString().split("T")[0],
                            }}
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