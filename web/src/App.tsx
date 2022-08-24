import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import SignupConfirmation from "./routes/SignupConfirmation";
import { Helmet } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Helmet>
        <title>Meals</title>
      </Helmet>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/signup-confirmation/:token"
          element={<SignupConfirmation />}
        />
      </Routes>
    </>
  );
}

export default App;
