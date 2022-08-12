import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import { Helmet } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Helmet>
        <title>Meals</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </StrictMode>
  );
}

export default App;
