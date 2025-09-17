import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/recipes.css";

const categories = [
  "All Recipes",
  "Staples",
  "Curries",
  "Desserts",
  "Snacks",
  "Other",
];

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Recipes");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch recipes from backend
  useEffect(() => {
    fetch("http://localhost/tslrd/backend/api/getRecipes.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecipes(data.recipes);
          setFilteredRecipes(data.recipes);
        } else {
          console.error("Failed to fetch recipes:", data.message);
          setRecipes([]);
          setFilteredRecipes([]);
        }
      })
      .catch((err) => {
        console.error("Network error:", err);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = recipes;

    if (activeCategory !== "All Recipes") {
      filtered = filtered.filter((r) => r.category === activeCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  }, [activeCategory, searchTerm, recipes]);

  return (
    <div className="recipes-page">
      <header>
        <h1>Recipes</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="recipes-container">
        {filteredRecipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              data-category={recipe.category}
              onClick={() => navigate(`/view-recipe/${recipe.id}`)}
            >
              <img
                src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
                alt={recipe.name}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/150")
                }
              />
              <h3>{recipe.name}</h3>
            </div>
          ))
        )}
      </div>

      <footer>&copy; 2025 TSLRD. All rights reserved.</footer>
    </div>
  );
}

export default Recipes;
