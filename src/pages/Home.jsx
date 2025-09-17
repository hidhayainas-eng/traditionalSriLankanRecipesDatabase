import "../styles/home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ user, onLogout }) => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost/tslrd/backend/api/getFeaturedRecipes.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeaturedRecipes(data.recipes);
      });

    fetch("http://localhost/tslrd/backend/api/getTopRatedRecipes.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTopRatedRecipes(data.recipes);
      });
  }, []);

  return (
    <div>
      <header>
        <h1>
          Ceylon<span className="highlight">Kitchen</span>
        </h1>
        <p>
          Where tradition meets taste — authentic Sri Lankan recipes from all
          corners of the island.
        </p>

        <nav>
          <Link to="/" className="nav-link">
            <i className="fas fa-home" style={{ marginRight: "6px" }}></i> Home
          </Link>
          <Link to="/recipes" className="nav-link">
            <i className="fas fa-utensils" style={{ marginRight: "6px" }}></i>{" "}
            Recipes
          </Link>
          <Link to="/about" className="nav-link">
            <i
              className="fas fa-info-circle"
              style={{ marginRight: "6px" }}
            ></i>{" "}
            About
          </Link>

          {user ? (
            <Link to="/submit" className="nav-link">
              <i
                className="fas fa-plus-circle"
                style={{ marginRight: "6px" }}
              ></i>{" "}
              Submit
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              <i
                className="fas fa-sign-in-alt"
                style={{ marginRight: "6px" }}
              ></i>{" "}
              Login
            </Link>
          )}
        </nav>

        {user && (
          <div className="home-welcome">
            <span className="welcome-text">Welcome, {user}!</span>
            <button onClick={onLogout}>
              <i
                className="fas fa-sign-out-alt"
                style={{ marginRight: "6px" }}
              ></i>{" "}
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="home-container">
        <main>
          <section>
            <h2>Welcome to CeylonKitchen</h2>
            <p>Explore and celebrate Sri Lanka’s rich culinary heritage.</p>
            {user ? (
              <Link to="/submit">
                <button className="submit-btn">
                  <i
                    className="fas fa-plus-circle"
                    style={{ marginRight: "6px" }}
                  ></i>
                  Submit Recipe
                </button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="submit-btn">
                  <i
                    className="fas fa-sign-in-alt"
                    style={{ marginRight: "6px" }}
                  ></i>
                  Login to Submit Recipe
                </button>
              </Link>
            )}
          </section>

          <section className="featured-section">
            <h2>🌟 Featured Recipes</h2>
            <div className="featured-recipes">
              {featuredRecipes.length > 0 ? (
                featuredRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/view-recipe/${recipe.id}`}
                    className="recipe-card-link"
                  >
                    <div className="recipe-card">
                      <img
                        src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
                        alt={recipe.name}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                      <h3>{recipe.name}</h3>
                      <p>
                        {recipe.region} • {recipe.category}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No featured recipes found.</p>
              )}
            </div>
          </section>

          <section className="featured-section">
            <h2>⭐ Top-Rated Recipes</h2>
            <div className="featured-recipes">
              {topRatedRecipes.length > 0 ? (
                topRatedRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/view-recipe/${recipe.id}`}
                    className="recipe-card-link"
                  >
                    <div className="recipe-card">
                      <img
                        src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
                        alt={recipe.name}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/150")
                        }
                      />
                      <h3>{recipe.name}</h3>
                      <p>
                        {recipe.region} • {recipe.category}
                      </p>
                      <p>Rating: ⭐ {recipe.avg_rating}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No top-rated recipes yet.</p>
              )}
            </div>
          </section>
        </main>
      </div>

      <footer>&copy; 2025 TSLRD. All rights reserved.</footer>
    </div>
  );
};

export default Home;

/*
import "../styles/home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ user, onLogout }) => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [topRatedRecipes, setTopRatedRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost/tslrd/backend/api/getFeaturedRecipes.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeaturedRecipes(data.recipes);
      });

    fetch("http://localhost/tslrd/backend/api/getTopRatedRecipes.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTopRatedRecipes(data.recipes);
      });
  }, []);

  return (
    <div>
      <header>
        <h1>CeylonKitchen</h1>
        <p>
          Where tradition meets taste — authentic Sri Lankan recipes from all
          corners of the island.
        </p>

        <nav>
          <Link to="/">Home</Link> | <Link to="/recipes">Recipes</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          {user ? (
            <Link to="/submit">Submit</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        {user && (
          <div>
            <p>Welcome, {user}!</p>
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </header>

      <main>
        <section>
          <h2>Welcome to CeylonKitchen</h2>
          <p>Explore and celebrate Sri Lanka’s rich culinary heritage.</p>
          {user ? (
            <Link to="/submit">
              <button>Submit Recipe</button>
            </Link>
          ) : (
            <Link to="/login">
              <button>Login to Submit Recipe</button>
            </Link>
          )}
        </section>

        <section>
          <h2>🌟 Featured Recipes</h2>
          <div>
            {featuredRecipes.length > 0 ? (
              featuredRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/view-recipe/${recipe.id}`}>
                  <div>
                    <img
                      src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
                      alt={recipe.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <h3>{recipe.name}</h3>
                    <p>
                      {recipe.region} • {recipe.category}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No featured recipes found.</p>
            )}
          </div>
        </section>

        <section>
          <h2>⭐ Top-Rated Recipes</h2>
          <div>
            {topRatedRecipes.length > 0 ? (
              topRatedRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/view-recipe/${recipe.id}`}>
                  <div>
                    <img
                      src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
                      alt={recipe.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <h3>{recipe.name}</h3>
                    <p>
                      {recipe.region} • {recipe.category}
                    </p>
                    <p>Rating: ⭐ {recipe.avg_rating}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No top-rated recipes yet.</p>
            )}
          </div>
        </section>
      </main>

      <footer>&copy; 2025 TSLRD. All rights reserved.</footer>
    </div>
  );
};

export default Home;
*/
