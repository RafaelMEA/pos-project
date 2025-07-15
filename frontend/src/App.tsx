import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "sonner";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/products/Products";
import Categories from "./pages/admin/categories/Categories";
import Transaction from "./pages/admin/Transaction";
import Customers from "./pages/admin/Customers";
import Users from "./pages/admin/Users";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
          <Route
            path="/categories"
            element={<Categories />}
          />
          <Route
            path="/transaction"
            element={<Transaction />}
          />
          <Route
            path="/customers"
            element={<Customers />}
          />
          <Route
            path="/users"
            element={<Users />}
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </MainLayout>
    </Router>
  );
}

export default App;
