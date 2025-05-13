
// import { useEffect, useState } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children, roles }) => {
//   const { user, loading, validateToken } = useAuth();
//   const location = useLocation();
//   const [authChecked, setAuthChecked] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       await validateToken(); // Sets user internally in context
//       setAuthChecked(true);
//     };

//     checkAuth(); // Always check token on mount
//   }, []); // empty dependency array = run only on mount

//   // While loading or waiting for token validation
//   if (loading || !authChecked) {
//     return <div>Loading...</div>;
//   }

//   // If no user after auth check, redirect to login
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If user doesn't have the required role
//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // User is authenticated and authorized
//   return children;
// };

// export default PrivateRoute;

import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading, validateToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    validateToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;