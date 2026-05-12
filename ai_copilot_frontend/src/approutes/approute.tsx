import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import ProtectedRoute from "../components/protectedRoute";
import Chat from "../pages/chat";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
