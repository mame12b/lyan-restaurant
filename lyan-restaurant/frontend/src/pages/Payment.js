// PaymentPage.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import '../styles/global.css';


// Verify environment variable
console.log('Stripe Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Initialize Stripe with proper error handling
let stripePromise;
try {
  stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
} catch (error) {
  console.error('Stripe initialization failed:', error);
}


// Payment Form Component (uses Stripe hooks)
const PaymentForm = ({ clientSecret, order, reservation }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaymentProcessing(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (stripeError) throw stripeError;
      if (paymentIntent.status !== 'succeeded') throw new Error('Payment failed');

      await axios.post('/api/reservations', {
        ...reservation,
        order,
        paymentIntentId: paymentIntent.id
      });

      navigate('/confirmation', { state: { success: true } });
    } catch (error) {
      setError(error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Card Details</label>
        <CardElement className="card-element" />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        disabled={!stripe || paymentProcessing || !clientSecret}
        className="pay-button"
      >
        {paymentProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main Payment Page Component
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  const { reservation, order } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate('/reservation');
    } else {
      createPaymentIntent();
    }
  }, []);

  const createPaymentIntent = async () => {
    try {
      const totalAmount = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const { data } = await axios.post('/api/payment/create-intent', {
        amount: totalAmount * 100,
        currency: 'usd'
      });

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      navigate('/error', { state: { message: 'Payment initialization failed' } });
    } finally {
      setLoading(false);
    }
  };

  if (!location.state || loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  return (
    <div className="payment-page">
      <Elements stripe={stripePromise}>
        <div className="payment-container">
          <h1>Complete Your Payment</h1>
          
          <div className="order-summary">
            <h2>Order Details</h2>
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

          <PaymentForm 
            clientSecret={clientSecret}
            order={order}
            reservation={reservation}
          />
        </div>
      </Elements>
    </div>
  );
};

export default Payment;