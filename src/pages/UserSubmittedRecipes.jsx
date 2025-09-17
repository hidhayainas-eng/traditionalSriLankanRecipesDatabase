import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/userSubmittedRecipes.css";

const UserSubmittedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  // Fetch only recipes with status 'pending'
  const fetchPendingRecipes = async () => {
    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/getPendingRecipes.php"
      );
      const data = await res.json();
      if (data.success) {
        setRecipes(data.recipes);
      } else {
        setError("Failed to load user-submitted recipes.");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  // Approve recipe function
  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/approveRecipe.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: id }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
        setMessage("✅ Recipe approved successfully!");
      } else {
        setMessage(data.message || "❌ Failed to approve recipe.");
      }
    } catch {
      setMessage("❌ Network error. Please try again.");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete recipe function
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
        setMessage("✅ Recipe rejected!");
      } else {
        setMessage(data.message || "❌ Failed to delete recipe.");
      }
    } catch {
      setMessage("❌ Network error. Please try again.");
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return <p>Loading user-submitted recipes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-submitted-recipes">
      <h1>User Submitted Recipes (Pending Approval)</h1>

      {message && <div className="admin-message success">{message}</div>}

      {recipes.length === 0 ? (
        <p>No pending recipes found.</p>
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
                      alt={r.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
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
                  <button onClick={() => handleApprove(r.id)}>Approve</button>
                  <button onClick={() => handleDelete(r.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to="/admin-dashboard" className="back-link">
          &larr; Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UserSubmittedRecipes;
