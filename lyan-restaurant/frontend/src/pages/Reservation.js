import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import { startOfToday, isBefore } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.css";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [reservation, setReservation] = useState({
    date: startOfToday(),
    time: "19:00",
    numberOfGuests: 1,
    specialRequest: "",
  });

  // Authentication check
  useEffect(() => {
    if (!user) {
      navigate("/login", { 
        state: { 
          from: location,
          message: "Please log in to make a reservation" 
        } 
      });
    }
  }, [user, navigate, location]);

  // Authentication check for API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return; // Don't fetch if no user
        
        setLoading(true);
        setError("");

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = { Authorization: `Bearer ${token}` };

        const menuRes = await axios.get("http://localhost:5000/api/menu", { 
          headers,
          validateStatus: (status) => status < 500
        });

        if (!menuRes.data?.success) {
          throw new Error(menuRes.data?.message || "Request failed");
        }

        if (!Array.isArray(menuRes.data?.data)) {
          throw new Error("Invalid data format from server");
        }

        if (menuRes.data.data.length === 0) {
          setMenu([]);
          setError("No menu items available");
          return;
        }

        setMenu(menuRes.data.data);

      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to load menu items";
        setError(errorMessage);
        
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login", { 
            state: { 
              from: location,
              message: "Session expired. Please log in again" 
            } 
          });
        }
        
        console.error("Fetch error:", error);
        setMenu([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, location, navigate]);

  // Validation helper
  const validateReservation = () => {
    const errors = {};
    
    if (isBefore(reservation.date, startOfToday())) {
      errors.date = "Date cannot be in the past";
    }
    
    if (order.length === 0) {
      errors.order = "Please select at least one menu item";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateReservation()) return;

    navigate("/payment", {
      state: {
        reservation: {
          ...reservation,
          date: reservation.date.toISOString()
        },
        order: order.map(item => ({
          _id: item._id,
          quantity: item.quantity,
          price: item.price
        }))
      }
    });
  };

  if (!user) return null;

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading restaurant data...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>⚠️ Error Loading Data</h2>
      <p>{error}</p>
      <button 
        className="retry-button"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="reservation-container compact-form">
      <h1 className="form-title">Table Reservation</h1>
      
      <div className="form-section compact-fields">
        <div className="datetime-guests">
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker
              selected={reservation.date}
              onChange={date => {
                setReservation(prev => ({ ...prev, date }));
                setValidationErrors(prev => ({ ...prev, date: "" }));
              }}
              minDate={startOfToday()}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              popperPlacement="bottom"
            />
            {validationErrors.date && (
              <p className="error-message">{validationErrors.date}</p>
            )}
          </div>

          <div className="form-group">
            <label>Number of Guests</label>
            <div className="guest-selector">
              <button 
                type="button"
                onClick={() => setReservation(prev => ({ 
                  ...prev, 
                  numberOfGuests: Math.max(1, prev.numberOfGuests - 1)
                }))}
              >
                -
              </button>
              <span>{reservation.numberOfGuests}</span>
              <button 
                type="button"
                onClick={() => setReservation(prev => ({ 
                  ...prev, 
                  numberOfGuests: Math.min(10, prev.numberOfGuests + 1)
                }))}
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              value={reservation.specialRequest}
              onChange={e => setReservation(prev => ({
                ...prev,
                specialRequest: e.target.value
              }))}
              placeholder="Dietary restrictions, accessibility needs, etc."
              maxLength={200}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Select Your Dishes {validationErrors.order && (
          <span className="error-message"> - {validationErrors.order}</span>
        )}</h2>
        <div className="menu-grid">
          {menu.map(item => (
            <div 
              key={item._id} 
              className={`menu-item ${order.find(i => i._id === item._id) ? 'selected' : ''}`}
              onClick={() => {
                setOrder(prev => {
                  const existing = prev.find(i => i._id === item._id);
                  return existing
                    ? prev.filter(i => i._id !== item._id)
                    : [...prev, { ...item, quantity: 1 }];
                });
                setValidationErrors(prev => ({ ...prev, order: "" }));
              }}
            >
              <div className="menu-item-image">
                <img 
                  src={item.image || "/images/food-placeholder.jpg"} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "/images/food-placeholder.jpg";
                  }}
                />
                <span className="item-price">
                  ${(item.price || 0).toFixed(2)}
                </span>
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {order.find(i => i._id === item._id) && (
                  <div className="quantity-control">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrder(prev => prev.map(i => 
                          i._id === item._id 
                            ? { ...i, quantity: Math.max(1, i.quantity - 1) } 
                            : i
                        ));
                      }}
                    >
                      -
                    </button>
                    <span>{order.find(i => i._id === item._id).quantity}</span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrder(prev => prev.map(i => 
                          i._id === item._id 
                            ? { ...i, quantity: i.quantity + 1 } 
                            : i
                        ));
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="btn-primary"
        onClick={handleProceedToPayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default Reservation;