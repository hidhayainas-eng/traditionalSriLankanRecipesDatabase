import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Make sure this import is included
import "../styles/adminDashboard.css"; // External CSS

const AdminDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/getRecipes.php"
      );
      const data = await res.json();
      if (data.success) {
        setRecipes(data.recipes);
      } else {
        setError("Failed to load recipes.");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/deleteRecipe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
        setMessage("✅ Recipe deleted successfully!");
      } else {
        setMessage(data.message || "❌ Failed to delete recipe.");
      }
    } catch {
      setMessage("❌ Network error. Please try again.");
    }

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <button onClick={() => navigate("/add-recipe")}>Add Recipe</button>
      <button onClick={() => navigate("/admin/user-submitted-recipes")}>
        View User Submitted Recipes
      </button>

      {message && <div className="admin-message success">{message}</div>}

      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Region</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.region}</td>
                <td>{r.category}</td>
                <td>
                  {r.image ? (
                    <img
                      src={`http://localhost/tslrd/backend/uploads/${r.image}`}
                      alt=""
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/50")
                      }
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/admin/view-recipe/${r.id}`)}
                  >
                    View
                  </button>

                  <button onClick={() => navigate(`/edit-recipe/${r.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="back-link-container">
        <Link to="/" className="back-link">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
