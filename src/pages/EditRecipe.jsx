import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editRecipe.css";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    region: "",
    category: "Staples",
    ingredients: "",
    instructions: "",
    image: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `http://localhost/tslrd/backend/api/getRecipeById.php?id=${id}`
        );
        const data = await res.json();
        if (data.success) {
          const r = data.recipe;
          setFormData({
            name: r.name || "",
            region: r.region || "",
            category: r.category || "Staples",
            ingredients: r.ingredients || "",
            instructions: r.instructions || "",
            image: null, // image file will be uploaded if changed
          });
          setCurrentImage(r.image || "");
        } else {
          alert("Recipe not found");
          navigate("/admin-dashboard");
        }
      } catch (err) {
        alert("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    form.append("id", id);

    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/editRecipe.php",
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Recipe updated successfully!");
        navigate("/admin-dashboard");
      } else {
        alert(data.message || "Failed to update recipe.");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading recipe...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="edit-form"
    >
      <h2>Edit Recipe</h2>

      <label>Name *</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label>Region</label>
      <input name="region" value={formData.region} onChange={handleChange} />

      <label>Category</label>
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="Staples">Staples</option>
        <option value="Curries">Curries</option>
        <option value="Desserts">Desserts</option>
        <option value="Snacks">Snacks</option>
        <option value="Other">Other</option>
      </select>

      <label>Ingredients *</label>
      <textarea
        name="ingredients"
        value={formData.ingredients}
        onChange={handleChange}
        required
      />

      <label>Instructions *</label>
      <textarea
        name="instructions"
        value={formData.instructions}
        onChange={handleChange}
        required
      />

      {currentImage && (
        <div>
          <label>Current Image</label>
          <img
            src={`http://localhost/tslrd/backend/uploads/${currentImage}`}
            alt="Current Recipe"
            style={{ maxWidth: "200px", marginBottom: "1rem" }}
          />
        </div>
      )}

      <label>Update Image (optional)</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Updating..." : "Update"}
      </button>
      <button type="button" onClick={() => window.location.reload()}>
        Cancel
      </button>
    </form>
  );
};

export default EditRecipe;
