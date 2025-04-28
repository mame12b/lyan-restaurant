import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Reservation = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    date: "",
    time: "",
    numberOfGuests: 1,
    specialRequest: "", // Optional field
  });
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  // ✅ Get userId from the backend before making a reservation
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(data._id);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/reservations",
        {
          userId, // ✅ Send user ID
          restaurantID: restaurantId, // ✅ Required restaurant ID
          ...reservation,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/reservations"); // Redirect to reservation list
    } catch (err) {
      setError(err.response?.data?.message || "Reservation failed");
    }
  };

  return (
    <div className="container">
      <h2>Book a Reservation</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" onChange={handleChange} required />
        <input type="time" name="time" onChange={handleChange} required />
        <input
          type="number"
          name="numberOfGuests"
          min="1"
          placeholder="Number of Guests"
          onChange={handleChange}
          required
        />
        <textarea
          name="specialRequest"
          placeholder="Special requests (optional)"
          onChange={handleChange}
        />
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default Reservation;
