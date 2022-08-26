import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Recipe from "./routes/Recipe";
import RecipeNew from "./routes/RecipeNew";
import RecipeTitleForm from "./routes/RecipeTitleForm";
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
        <Route path="/recipe/:recipeId" element={<Recipe />} />
        <Route
          path="/recipe/:recipeId/title/edit"
          element={<RecipeTitleForm />}
        />
        <Route path="/recipe/new" element={<RecipeNew />} />
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
