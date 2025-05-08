import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, startOfToday } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.css";

const stripePromise = loadStripe('pk_test_your_actual_key_here');

const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
        const [branchesRes, menuRes] = await Promise.all([
          axios.get("http://localhost:5000/api/branches"),
          axios.get("http://localhost:5000/api/menu"),
        ]);
        setBranches(branchesRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    if(user) fetchData();
  }, [user]);

  if (!user) return null;

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

      <Elements stripe={stripePromise}>
        <PaymentForm
          order={order}
          reservation={reservation}
          paymentProcessing={paymentProcessing}
          setPaymentProcessing={setPaymentProcessing}
          setShowConfirmation={setShowConfirmation}
        />
      </Elements>

      {showConfirmation && (
        <ConfirmationModal
          branches={branches}
          reservation={reservation}
          order={order}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

const PaymentForm = ({ 
  order, 
  reservation, 
  paymentProcessing,
  setPaymentProcessing,
  setShowConfirmation
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      if (!stripe || !elements) return;

      const clientSecret = await createPaymentIntent();
      if (!clientSecret) throw new Error("Failed to create payment intent");

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.name || "",
            email: user?.email || ""
          }
        }
      });

      if (error) throw error;

      await axios.post("/api/reservations", {
        ...reservation,
        userId: user?._id,
        order,
        paymentStatus: "completed",
        totalAmount: order.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });

      setShowConfirmation(true);
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message);
      if (error.response?.status === 401) {
        navigate('/login', { state: { from: location } });
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  const createPaymentIntent = async () => {
    try {
      const { data } = await axios.post("/api/payment/create-intent", {
        amount: order.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100
      });
      return data.clientSecret;
    } catch (error) {
      console.error("Payment intent error:", error);
      return null;
    }
  };

  return (
    <div className="payment-section">
      <h2>Payment Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Card Details</label>
          <CardElement className="card-element" />
        </div>

        <div className="order-summary">
          <h3>Order Total</h3>
          {order.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total-amount">
            Total: ${order.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={!stripe || paymentProcessing}
        >
          {paymentProcessing ? "Processing..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
};

const ConfirmationModal = ({ 
  branches = [],
  reservation = {}, 
  order = [], 
  onClose 
}) => {
  const branch = branches.find(b => b._id === reservation.branchId);
  const reservationDate = reservation.date ? new Date(reservation.date) : new Date();

  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>Reservation Confirmed!</h2>
        <div className="confirmation-details">
          <p><strong>Branch:</strong> {branch?.name || 'Selected Branch'}</p>
          <p><strong>Date:</strong> {format(reservationDate, "MMM do, yyyy")}</p>
          <p><strong>Guests:</strong> {reservation.numberOfGuests || 1}</p>
          
          <h3>Order Summary</h3>
          {order.map(item => (
            <div key={item._id} className="order-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total-amount">
            Total: ${order.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
          </div>
        </div>

        <button className="btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Reservation;