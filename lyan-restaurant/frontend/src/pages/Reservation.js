import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import { startOfToday } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.css";

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reservation, setReservation] = useState({
    branchId: "",
    date: startOfToday(),
    numberOfGuests: 1,
    specialRequest: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { 
          from: location,
          message: "You need to login to make a reservation"
        }
      });
    }
  }, [user, navigate, location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };

        const [branchesRes, menuRes] = await Promise.all([
          axios.get("http://localhost:5000/api/branches", {headers}),
          axios.get("http://localhost:5000/api/menu", {headers}),
        ]);
        if (!branchesRes.data?.length) {
          throw new Error("No branches available");
        }
        if (!menuRes.data?.length) {
          throw new Error("Menu items not found");
        }

        setBranches(branchesRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error("Data fetch error:", error);
        setError(error.response?.data?.message || error.message || "Failed to load data");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    
    if(user) fetchData();
  }, [user]);

  const handleProceedToPayment = () => {
    if (!reservation.branchId || order.length === 0) {
      alert('Please select a branch and at least one menu item');
      return;
    }

    navigate("/payment", {
      state: {
        reservation: {
          ...reservation,
          date: reservation.date.toISOString()
        },
        order,
        branches
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
        <div className="branch-selection">
          <h2>Select Restaurant</h2>
          <div className="branch-cards">
            {branches.map(branch => (
              <div 
                key={branch._id}
                className={`branch-card ${reservation.branchId === branch._id ? 'selected' : ''}`}
                onClick={() => setReservation(prev => ({ ...prev, branchId: branch._id }))}
              >
                <img src={branch.image} alt={branch.name} />
                <div className="branch-info">
                  <h3>{branch.name}</h3>
                  <p>{branch.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="datetime-guests">
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker
              selected={reservation.date}
              onChange={date => setReservation(prev => ({ ...prev, date }))}
              minDate={startOfToday()}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              popperPlacement="bottom"
            />
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
                  numberOfGuests: prev.numberOfGuests + 1 
                }))}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-section">
        <h2>Select Your Dishes</h2>
        <div className="menu-grid">
          {menuItems.map(item => (
            <div 
              key={item._id} 
              className={`menu-item ${order.find(i => i._id === item._id) ? 'selected' : ''}`}
              onClick={() => setOrder(prev => {
                const existing = prev.find(i => i._id === item._id);
                return existing
                  ? prev.filter(i => i._id !== item._id)
                  : [...prev, { ...item, quantity: 1 }];
              })}
            >
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
                <span className="item-price">${item.price}</span>
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
                          i._id === item._id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
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
                          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
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
        disabled={!reservation.branchId || order.length === 0}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Reservation;