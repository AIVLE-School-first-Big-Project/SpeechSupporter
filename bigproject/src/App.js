import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aivle from "./Aivle";
import MainPage from "./MainPage";
import Register from "./Register";
import Board from "./Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/video" element={<Aivle />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
