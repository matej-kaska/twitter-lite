import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useEffect, useState } from 'react';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (token) {
      axios.get('/api/token', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
      .then(response => {
        setIsAuthenticated(true);
        localStorage.setItem("id_of_user", response.data.id);
        localStorage.setItem("username", response.data.username);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      })
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}

export default PrivateRoute;