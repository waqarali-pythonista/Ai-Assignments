import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Products } from './components/Products';
import { Transactions } from './components/Transactions';
import { Admin } from './components/Admin';
import { Cart } from './components/Cart';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoadingProvider } from './contexts/LoadingContext';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  return isAuthenticated && isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to={isAuthenticated ? '/' : '/login'} />
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Login onLogin={() => {}} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Signup onSignup={() => {}} />
          )
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Products />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Layout>
              <Cart />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Layout>
              <Transactions />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Layout>
              <Admin />
            </Layout>
          </AdminRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <NotificationProvider>
              <LoadingProvider>
                <Router>
                  <AppRoutes />
                </Router>
              </LoadingProvider>
            </NotificationProvider>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
