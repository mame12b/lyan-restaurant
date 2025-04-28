import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { useAuth } from './context/AuthContext';
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
import Branches from './pages/Branches';
import Menu from './pages/Menu';
import CateringOrders from './pages/CateringOrders';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Restaurants from './pages/admin/Restaurants';
import Branch from './pages/admin/Branch';
import Menus from './pages/admin/Menus';
import Orders from './pages/admin/Orders';
import User from './pages/admin/User';
import Settings from './pages/admin/Settings';
import PrivateRoute from './routes/PrivateRoute';
//import { ThemeProviderWrapper } from './context/ThemeContext';
import './styles/global.css';

function App() {

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
          <Route path="/branches/:restaurantId" element={<Branches />} />
          <Route path="/menu/:branchId" element={<Menu />} />
          <Route path="/catering-order" element={<CateringOrders />} />

          {/* Role based redirect */}
          <Route path="/" element={
        <PrivateRoute>
          <Navigate to={
            localStorage.getItem('token') 
              ? (JSON.parse(localStorage.getItem('user'))?.role === 'admin' 
                  ? '/admin/dashboard' 
                  : '/user/dashboard')
              : '/login'
          } replace />
        </PrivateRoute>
      }/>

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
          <Route path="/admin/branches" element={<Branch />} />
          <Route path="/admin/menus" element={<Menus />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/user" element={<User />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
    
  );
}

export default App;
