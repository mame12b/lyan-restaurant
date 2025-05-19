// import Reservation from "../models/Reservation.js";

// // ✅ Create a reservation
// export const createReservation = async (req, res) => {
//     try {
//         console.log("Authenticated User:", req.user); // Debugging

//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ message: "User not found or not authenticated" });
//         }

//         const { branchId, date, time, numberOfGuests, specialRequest } = req.body;

//         if (!branchId || !date || !time || !numberOfGuests) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const newReservation = new Reservation({
//             userId: req.user._id, 
//             branchId,
//             date,
//             time,
//             numberOfGuests,
//             specialRequest
//         });

//         await newReservation.save();
//         res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
//     } catch (error) {
//         console.error("Error creating reservation:", error.message);
//         res.status(500).json({ message: "Error creating reservation", error: error.message });
//     }
// };

// // ✅ Get all reservations for a user
// export const getUserReservations = async (req, res) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ message: "User not found" });
//         }

//         const reservations = await Reservation.find({ userId: req.user._id }).populate("restaurantID", "name location");
//         res.status(200).json(reservations);
//     } catch (error) {
//         console.error("Error fetching reservations:", error.message);
//         res.status(500).json({ message: "Error fetching reservations", error: error.message });
//     }
// };


// // Update a reservation by ID
// export const updateReservation = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedReservation) return res.status(404).json({ message: 'Reservation not found' });
//         res.status(200).json(updatedReservation);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating reservation', error: error.message });
//     }
// };

// // Delete a reservation by ID
// export const deleteReservation = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const deletedReservation = await Reservation.findByIdAndDelete(id);
//         if (!deletedReservation) return res.status(404).json({ message: 'Reservation not found' });
//         res.status(200).json({ message: 'Reservation deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting reservation', error: error.message });
//     }
// };

import Reservation from "../models/Reservation.js";
import Branch from "../models/Branch.js"; // Import Branch model for validation

// ✅ Create a reservation
export const createReservation = async (req, res) => {
    try {
        // Authentication check
        if (!req.user?._id) {
            return res.status(401).json({ 
                success: false,
                error: "User authentication required" 
            });
        }

        // Validate required fields
        const { branchId, date, time, numberOfGuests, specialRequest } = req.body;
        if (!branchId || !date || !time || !numberOfGuests) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: branchId, date, time, numberOfGuests"
            });
        }

        // Validate branch exists
        const branchExists = await Branch.exists({ _id: branchId });
        if (!branchExists) {
            return res.status(404).json({
                success: false,
                error: "Branch not found"
            });
        }

        // Validate date format and future date
        const reservationDate = new Date(date);
        if (isNaN(reservationDate)) {
            return res.status(400).json({
                success: false,
                error: "Invalid date format"
            });
        }

        // Create and save reservation
        const newReservation = new Reservation({
            userId: req.user._id,
            branchId,
            date: reservationDate,
            time,
            numberOfGuests: Number(numberOfGuests),
            specialRequest: specialRequest || ""
        });

        await newReservation.save();
        
        return res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            reservation: newReservation
        });

    } catch (error) {
        console.error("Reservation creation error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// ✅ Get all reservations for a user
export const getUserReservations = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                error: "User authentication required"
            });
        }

        const reservations = await Reservation.find({ userId: req.user._id })
            .populate("branchId", "name location openingHours") // Fixed populate field
            .sort({ date: -1 });

        return res.status(200).json({
            success: true,
            count: reservations.length,
            reservations
        });

    } catch (error) {
        console.error("Reservation fetch error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch reservations",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Update a reservation by ID
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, numberOfGuests, specialRequest } = req.body;

        // Find reservation and verify ownership
        const reservation = await Reservation.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: "Reservation not found or unauthorized"
            });
        }

        // Update allowed fields
        if (date) reservation.date = new Date(date);
        if (time) reservation.time = time;
        if (numberOfGuests) reservation.numberOfGuests = Number(numberOfGuests);
        if (specialRequest) reservation.specialRequest = specialRequest;

        await reservation.save();

        return res.status(200).json({
            success: true,
            message: "Reservation updated successfully",
            reservation
        });

    } catch (error) {
        console.error("Reservation update error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

// Delete a reservation by ID
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReservation = await Reservation.findOneAndDelete({
            _id: id,
            userId: req.user._id
        });

        if (!deletedReservation) {
            return res.status(404).json({
                success: false,
                error: "Reservation not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Reservation deleted successfully"
        });

    } catch (error) {
        console.error("Reservation deletion error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};