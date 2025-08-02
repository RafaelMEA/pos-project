import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";

import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/products/Products";
import Categories from "./pages/admin/categories/Categories";
import Transaction from "./pages/admin/Transaction";
import Customers from "./pages/admin/Customers";
import Users from "./pages/admin/Users";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/routing/ProtectedRoute";
import GuestRoute from "./components/routing/GuestRoute";

// Layout wrapper component
const ProtectedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth pages - without layout */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Protected routes - with MainLayout */}
          <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Redirect to login for any other route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;