import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aivle from "./Screens/Aivle";
import LoginPage from "./Screens/LoginPage";
import MainPage from "./Screens/MainPage";
import PrivateRoute from "./Utiles/PrivateRoute";

import Register from "./Screens/Register";
import ResetPassword from "./Screens/ResetPassword";
import SendEmail from "./Screens/SendEmail";
import Community from "./Community";
import Board from "./Board";
import Modify from "./Modify";
import Write from "./Write";
import Modify_feedback from "./Modify_feedback";
import Modify_post from "./Modify_post";

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
        <Route path="aivle/send_email" element={<SendEmail />} />
        <Route path="aivle/reset_password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/write" element={<Write />} />
        <Route
          path="/modify"
          element={
            <PrivateRoute>
              <Modify />
            </PrivateRoute>
          }
        />
        <Route
          path="/modify_feedback"
          element={
            <PrivateRoute>
              <Modify_feedback />
            </PrivateRoute>
          }
        />
        <Route
          path="/modify_post"
          element={
            <PrivateRoute>
              <Modify_post />
            </PrivateRoute>
          }
        />
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </Router>
  );
}
export default App;
