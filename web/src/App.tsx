import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Login from "./routes/Login";
import RequireAuthn from "./components/RequireAuthn";
import RequireGuest from "./components/RequireGuest";
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
        <Route
          path="/"
          element={
            <RequireGuest>
              <Home />
            </RequireGuest>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuthn>
              <Dashboard />
            </RequireAuthn>
          }
        />

        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />

        <Route
          path="/signup"
          element={
            <RequireGuest>
              <Signup />
            </RequireGuest>
          }
        />

        <Route
          path="/signup-confirmation/:token"
          element={
            <RequireGuest>
              <SignupConfirmation />
            </RequireGuest>
          }
        />
      </Routes>
    </>
  );
}

export default App;
