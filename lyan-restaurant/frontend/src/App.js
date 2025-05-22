import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import RestaurantList from './pages/RestaurantList';
import Reservation from './pages/Reservation';
import RestaurantDetails from './pages/RestaurantDetails';
import Menu from './pages/Menu';
import CateringOrders from './pages/CateringOrders';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Restaurants from './pages/admin/Restaurants';
import Branches from './pages/admin/Branches';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/NotFound';
import Dashboard from './pages/Dashboard';  
import './styles/global.css';
import Users from './pages/admin/Users';
import  Payment  from './pages/Payment';

function App() {
const { loading } = useAuth();

if (loading) return <div>loading...</div>
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path='/payment' element={<Payment />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
          <Route path="/catering-order" element={<CateringOrders />} />

      <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard /> {/* This can be a layout component if needed */}
    </PrivateRoute>
  }
/>
     {/* User-only Routes */}
          <Route path="/reservation" element={
            <PrivateRoute roles={['user']}>
              <Reservation />
            </PrivateRoute>
          } />
          <Route path="/payment" element={
            <PrivateRoute roles={['user']}>
              <Payment />
            </PrivateRoute>
          } />
          <Route path="/user/dashboard" element={
            <PrivateRoute roles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          } />

          {/* Admin-only Routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/reservations" element={
            <PrivateRoute roles={['admin']}>
              <Reservation />
            </PrivateRoute>
          } />
          <Route path="/admin/restaurants" element={
            <PrivateRoute roles={['admin']}>
              <Restaurants />
            </PrivateRoute>
          } />
          <Route path="/admin/branches" element={
            <PrivateRoute roles={['admin']}>
              <Branches />
            </PrivateRoute>
          } />
          <Route path="/admin/orders" element={
            <PrivateRoute roles={['admin']}>
              <Orders />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute roles={['admin']}>
              <Users />
            </PrivateRoute>
          } />
          <Route path="/admin/settings" element={
            <PrivateRoute roles={['admin']}>
              <Settings />
            </PrivateRoute>
          } />
          
         
        </Routes>
      </Suspense>
    </Router>
    
  );
}

export default App;
