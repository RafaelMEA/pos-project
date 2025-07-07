import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { Toaster } from "sonner";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />
        </Routes>
        <Toaster position="top-right" richColors />
      </MainLayout>
    </Router>
  );
}

export default App;
