import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Settings from './pages/admin/Settings';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/NotFound';
import './styles/global.css';
import Users from './pages/admin/Users';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import CateringOrders from './pages/CateringOrders';

function App() {
const { loading } = useAuth();

if (loading) return <div>loading...</div>
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
      <Navbar />
      <WhatsAppButton />
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="/booking" element={
            <PrivateRoute roles={['user']}>
              <Booking />
            </PrivateRoute>
          } />
          <Route path="/user/dashboard" element={
            <PrivateRoute roles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          } />
          <Route path="/catering-order" element={
            <PrivateRoute roles={['user']}>
              <CateringOrders />
            </PrivateRoute>
          } />

          {/* Admin-only Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
         
        </Routes>
      </Suspense>
      <Footer />
    </Router>
    </>
  );
}

export default App;
