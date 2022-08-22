import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import SignupConfirmation from "./routes/SignupConfirmation";
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
        <Route
          path="/signup-confirmation/:token"
          element={<SignupConfirmation />}
        />
      </Routes>
    </StrictMode>
  );
}

export default App;
