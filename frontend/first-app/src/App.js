import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { AuthProvidor } from './contexts/AuthContext';
function App() {
  return (
    <AuthProvidor>
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="*" element={<Home/>} />
    </Routes>
    </AuthProvidor>
  );
}

export default App;
