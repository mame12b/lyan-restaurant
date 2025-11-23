import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoadingSpinner from './components/LoadingSpinner';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import './styles/global.css';
import { backendBaseUrl } from './services/api';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const Packages = lazy(() => import('./pages/Packages'));
const Booking = lazy(() => import('./pages/Booking'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const CateringOrders = lazy(() => import('./pages/CateringOrders'));

function App() {
  const { loading } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    // Warm up the backend so the first authenticated request feels snappier on cold starts.
    fetch(`${backendBaseUrl}/health`, { signal: controller.signal }).catch(() => {});

    return () => controller.abort();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <ScrollToTop />
        <Navbar />
        <WhatsAppButton />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />

            {/* User-only Routes */}
            <Route
              path="/booking"
              element={
                <PrivateRoute roles={['user']}>
                  <Booking />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <PrivateRoute roles={['user']}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute roles={['user']}>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            <Route
              path="/catering-order"
              element={
                <PrivateRoute roles={['user']}>
                  <CateringOrders />
                </PrivateRoute>
              }
            />

            {/* Admin-only Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </>
  );
}

export default App;
