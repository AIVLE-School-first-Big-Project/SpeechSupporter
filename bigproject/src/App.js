import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aivle from "./Screens/Aivle";
import LoginPage from "./Screens/LoginPage";
import MainPage from "./Screens/MainPage";
import PrivateRoute from "./Utiles/PrivateRoute";

import Register from "./Screens/Register";
import ResetPassword from "./Screens/ResetPassword";
import SendEmail from "./Screens/SendEmail";

import Community from "./Community";
import Write from "./Write";
import Modify from "./Modify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="aivle/main"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
        <Route path="aivle/video" element={<Aivle />} />
        <Route
          path="aivle/send_email"
          element={
            <PrivateRoute>
              <SendEmail />
            </PrivateRoute>
          }
        />
        <Route
          path="aivle/reset_password"
          element={
            <PrivateRoute>
              <ResetPassword />
            </PrivateRoute>
          }
        />
        <Route path="/community" element={<Community />} />
        <Route path="/write" element={<Write />} />
        <Route path="/modify" element={<Modify />} />
      </Routes>
    </Router>
  );
}

export default App;
