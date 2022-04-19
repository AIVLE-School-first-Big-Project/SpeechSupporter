import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aivle from "./Aivle";
import MainPage from "./MainPage";
import Register from "./Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/video" element={<Aivle />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
