import Home from "./routes/Home";
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
      </Routes>
    </StrictMode>
  );
}

export default App;
