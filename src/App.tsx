import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import RegisterOptions from "./modules/auth/pages/RegisterOptions";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route path="/register" element={<RegisterOptions />} />
        <Route path="/register/emprendedor" element={<div>Registro Emprendedor</div>} />
        <Route path="/register/cliente" element={<div>Registro Cliente</div>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
