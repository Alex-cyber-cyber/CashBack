
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/components/auth/Login/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/index" replace />} />
        
        <Route path="/index" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App
