
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './modules/auth/pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/LoginPage" replace />} />
        
        <Route path="/LoginPage" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App
