import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddServer from "./pages/AddServer";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";

// Guard: redirect to /login if no token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Guard: redirect to /dashboard if already logged in
function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute><Signup /></GuestRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/add-server" element={
          <ProtectedRoute><AddServer /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;