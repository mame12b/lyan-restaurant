import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading, validateToken } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
      await validateToken();
      setAuthChecked(true);
    };
    if (!user) checkAuth();

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (roles && !roles.includes(user.role)) {

    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;