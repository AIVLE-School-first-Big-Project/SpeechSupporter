import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aivle from "./Aivle";
import MainPage from "./MainPage";
import Register from "./Register";
import Community from "./Community";
import Write from "./Write";
import Modify from "./Modify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/video" element={<Aivle />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/write" element={<Write />} />
        <Route path="/modify" element={<Modify />} />
      </Routes>
    </Router>
  );
}

export default App;
