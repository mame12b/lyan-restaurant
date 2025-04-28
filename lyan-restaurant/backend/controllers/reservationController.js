import Reservation from "../models/Reservation.js";

// ✅ Create a reservation
export const createReservation = async (req, res) => {
    try {
        console.log("Authenticated User:", req.user); // Debugging

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not found or not authenticated" });
        }

        const { branchId, date, time, numberOfGuests, specialRequest } = req.body;

        if (!branchId || !date || !time || !numberOfGuests) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newReservation = new Reservation({
            userId: req.user._id, 
            branchId,
            date,
            time,
            numberOfGuests,
            specialRequest
        });

        await newReservation.save();
        res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
    } catch (error) {
        console.error("Error creating reservation:", error.message);
        res.status(500).json({ message: "Error creating reservation", error: error.message });
    }
};

// ✅ Get all reservations for a user
export const getUserReservations = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not found" });
        }

        const reservations = await Reservation.find({ userId: req.user._id }).populate("restaurantID", "name location");
        res.status(200).json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error.message);
        res.status(500).json({ message: "Error fetching reservations", error: error.message });
    }
};


// Update a reservation by ID
export const updateReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedReservation) return res.status(404).json({ message: 'Reservation not found' });
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation', error: error.message });
    }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedReservation = await Reservation.findByIdAndDelete(id);
        if (!deletedReservation) return res.status(404).json({ message: 'Reservation not found' });
        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reservation', error: error.message });
    }
};