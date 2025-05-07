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
import User from './pages/admin/User';
import Settings from './pages/admin/Settings';
import PrivateRoute from './routes/PrivateRoute';
import NotFound from './components/NotFound';
import Dashboard from './pages/Dashboard';  
import './styles/global.css';

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

          {/* User protected route */}
          <Route path="/user/dashboard" element={
            <PrivateRoute roles={['user']}>
              <UserDashboard />
            </PrivateRoute>
          } />

          {/* Admin protected routes */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/restaurants" element={<Restaurants />} />
          <Route path="/admin/branches" element={<Branches />} />
          <Route path="/admin/menus" element={<Menu />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
    
  );
}

export default App;
