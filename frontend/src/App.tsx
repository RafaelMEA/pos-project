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
import ViewProduct from "./pages/admin/products/ViewProduct";
import Categories from "./pages/admin/categories/Categories";
import Transaction from "./pages/admin/Transaction";
import Customers from "./pages/admin/Customers";
import Users from "./pages/admin/Users";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ProtectedRoute, PublicRoute } from "./components/routing/ProtectedRoute";


// Layout wrapper for protected routes
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
        <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* for products */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productName" element={<ViewProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/users" element={<Users />} />
          </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
