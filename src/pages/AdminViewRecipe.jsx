// src/pages/AdminViewRecipe.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/adminViewRecipe.css"; // External CSS import

const AdminViewRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/tslrd/backend/api/getRecipeById.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipe(data.recipe);
        } else {
          setError(data.message || "Failed to load recipe.");
        }
      })
      .catch(() => {
        setError("Network error. Please try again later.");
      });
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!recipe) return <p className="loading-message">Loading recipe...</p>;

  return (
    <div className="admin-view-recipe-container">
      <h1>{recipe.name}</h1>
      <img
        src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
        alt={recipe.name}
        className="recipe-image"
        onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
      />
      <p>
        <strong>Region:</strong> {recipe.region}
      </p>
      <p>
        <strong>Category:</strong> {recipe.category}
      </p>
      <h3>Ingredients</h3>
      <ul>
        {recipe.ingredients.split("\n").map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <div className="instructions-section">
        {recipe.instructions
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .reduce((acc, line) => {
            // Check if the line is a heading (ends with ':')
            if (line.endsWith(":")) {
              acc.push({ heading: line, steps: [] });
            } else if (acc.length > 0) {
              acc[acc.length - 1].steps.push(line);
            }
            return acc;
          }, [])
          .map((section, index) => (
            <div key={index} className="instruction-block">
              <h4>{section.heading}</h4>
              <ul>
                {section.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default AdminViewRecipe;
