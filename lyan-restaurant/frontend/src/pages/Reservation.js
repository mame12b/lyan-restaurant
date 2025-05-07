import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, startOfToday } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/global.css";

const stripePromise = loadStripe('pk_test_your_actual_key_here');



const Reservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Get authenticated user from context

  // Reservation state
  const [step, setStep] = useState(1);
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
 
  const [reservation, setReservation] = useState({
  branchId: "",
  date: null,
  time: "",
  numberOfGuests: 1,
  specialRequest: "",
});

 // Fetch branches with error handling
 useEffect(() => {
  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/branches");
      if(response.data && Array.isArray(response.data)) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      alert("Failed to load branches. Please try again later.");
    }
  };

  if(user) {
    fetchBranches();
  }
}, [user]);

    // Add authentication check
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

  // Fetch initial data
  useEffect(() => {
    if(!user) return;

    const fetchData = async () => {
      try {
        const [branchesRes, menuRes] = await Promise.all([
          axios.get("/api/branches"),
          axios.get("/api/menu"),
        ]);
        setBranches(branchesRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  
  // Step navigation
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="reservation-flow">
      <div className="progress-indicator">
        {['Branch & Time', 'Menu Selection', 'Payment'].map((label, index) => (
          <div key={label} className={`step ${index < step ? 'completed' : ''} ${index + 1 === step ? 'active' : ''}`}>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <BranchTimeSelection
          branches={branches}
          reservation={reservation}
          setReservation={setReservation}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <MenuSelection
          menuItems={menuItems}
          order={order}
          setOrder={setOrder}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {step === 3 && (
        <Elements stripe={stripePromise}>
          <PaymentStep
            order={order}
            reservation={reservation}
            prevStep={prevStep}
            paymentProcessing={paymentProcessing}
            setPaymentProcessing={setPaymentProcessing}
            setShowConfirmation={setShowConfirmation}
          />
        </Elements>
      )}

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

  const BranchTimeSelection = ({ branches, reservation, setReservation, nextStep }) => {
  const [availability, setAvailability] = useState({ loading: false, timeSlots: [] });

  const fetchAvailability = async (branchId, date) => {
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const { data } = await axios.get(
        `/api/availability/${branchId}?date=${dateString}`
      );
      setAvailability({ 
        loading: false, 
        timeSlots: data.timeSlots, 
        error: "" 
      });

    } catch (error) {
      setAvailability({ 
        loading: false,
        timeSlots: [], 
        error: error.message
       });
    }
  };

  const handleBranchChange = async (branchId) => {
    setReservation(prev => ({ ...prev, branchId, date: null, time: "" }));
  };

  const handleDateChange = date => {
    setReservation(prev => ({ ...prev, date, time: "" }));
    fetchAvailability(reservation.branchId, date);
  };

  return (
    <div className="reservation-step">
      <h2>Select Branch & Time</h2>
      
      <div className="form-group">
        <label>Select Branch</label>
        <select
          value={reservation.branchId}
          onChange={(e) => handleBranchChange(e.target.value)}
          className="form-control"
          required
        >
          <option value="">Choose a branch</option>
          {branches.map(branch => (
            <option key={branch._id} value={branch._id}>
              {branch.name} - {branch.location}
            </option>
          ))}
        </select>
      </div>

      {reservation.branchId && (
        <>
          <div className="form-group">
            <label>Select Date</label>
            <DatePicker
              selected={reservation.date}
              onChange={handleDateChange}
              minDate={startOfToday()}
              maxDate={new Date().setMonth(new Date().getMonth() + 3)}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              required
            />
          </div>

          {reservation.date && (
            <div className="form-group">
              <label>Select Time</label>
              <div className="time-slots">
                {availability.loading ? (
                  <div className="loading">Loading available times...</div>
                ) : availability.timeSlots.length > 0 ? (
                  availability.timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      className={`time-slot ${reservation.time === slot.time ? 'selected' : ''}`}
                      onClick={() => setReservation(prev => ({ ...prev, time: slot.time }))}
                    >
                      {format(new Date(`2000-01-01T${slot.time}`), 'h:mm a')}
                    </button>
                  ))
                ) : (
                  <div className="error">No available time slots for this date</div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <button
        type="button"
        className="btn-primary"
        onClick={nextStep}
        disabled={!reservation.branchId || !reservation.date || !reservation.time}
      >
        Continue to Menu
      </button>
    </div>
  );};

const MenuSelection = ({ menuItems, order, setOrder, nextStep, prevStep }) => {
  const addToOrder = (item) => {
    setOrder(prev => {
      const existing = prev.find(i => i._id === item._id);
      return existing
        ? prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const totalAmount = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="reservation-step">
      <h2>Select Menu Items</h2>
      
      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item._id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="item-footer">
              <span>${item.price}</span>
              <button type="button" onClick={() => addToOrder(item)}>
                Add to Order ({order.find(i => i._id === item._id)?.quantity || 0})
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Your Order</h3>
        {order.map(item => (
          <div key={item._id} className="order-item">
            <span>{item.name} x{item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="total-amount">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="btn-primary" onClick={nextStep}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const PaymentStep = ({ 
  order, 
  reservation, 
  prevStep, 
  paymentProcessing,  // Added prop
  setPaymentProcessing, 
  setShowConfirmation 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const componentLocation = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    try {
      if(!user || !user._id) {
        throw new Error("user session expired. Please login again")
      }

      // api call with user ID
      await axios.post("/api/reservations",{
        ...reservation,
        userId: user._id,
        order,
        paymentStatus: "Completed"
      });
      // Create payment intent
      const { data: { clientSecret } } = await axios.post("/api/payment/create-intent", {
        amount: order.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100
      });

      // Confirm card payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      });

      if (error) throw error;

      // Create reservation
      await axios.post("/api/reservations", {
        ...reservation,
        userId: user._id,
        order,
        paymentStatus: "completed"
      });

      setShowConfirmation(true);
    } catch (error) {
      if (error.response?.status ===401) {
        navigate('/login', {
          state: {
            from: componentLocation 
          }
        });
      }
      console.error("Payment error:", error);
      alert(error.message);
      
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="reservation-step">
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

        <div className="step-actions">
          <button type="button" className="btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button type="submit" className="btn-primary" disabled={!stripe}>
            {paymentProcessing ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

const ConfirmationModal = ({ branches, reservation, order, onClose }) => {
  const branch = branches.find(b => b._id === reservation.branchId);
  
  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <h2>Reservation Confirmed!</h2>
        <div className="confirmation-details">
          <p><strong>Branch:</strong> {branch?.name || 'Selected Branch'}</p>
          <p><strong>Date:</strong> {format(reservation.date, "MMM do, yyyy")}</p>
          <p><strong>Time:</strong> {reservation.time}</p>
          <p><strong>Guests:</strong> {reservation.numberOfGuests}</p>
          
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