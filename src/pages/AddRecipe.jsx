import { useState } from "react";
import "../styles/addRecipe.css";

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    category: "Staples",
    ingredients: "",
    instructions: "",
    image: null,
  });

  const [successMessage, setSuccessMessage] = useState(""); // ✅ for message

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) form.append(key, formData[key]);
    }

    try {
      const response = await fetch(
        "http://localhost/tslrd/backend/api/addRecipe.php",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Recipe added successfully!"); // ✅ Set message
        setFormData({
          name: "",
          region: "",
          category: "Staples",
          ingredients: "",
          instructions: "",
          image: null,
        });

        // Optional: Hide message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        alert(data.message || "Failed to add recipe.");
      }
    } catch (error) {
      alert("Network error.");
    }
  };

  return (
    <div className="add-recipe-page">
      <div className="add-recipe-header">Add New Recipe</div>
      <form
        className="add-recipe-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Form Fields */}
        <label htmlFor="name">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        <label htmlFor="region">Region</label>
        <input
          type="text"
          id="region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="Region"
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Staples">Staples</option>
          <option value="Curries">Curries</option>
          <option value="Desserts">Desserts</option>
          <option value="Snacks">Snacks</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
        />

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="Instructions"
        />

        <label htmlFor="image">Upload Image</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
        <button type="button" onClick={() => window.location.reload()}>
          Cancel
        </button>
      </form>

      {/* ✅ Success Message at the bottom */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default AddRecipe;
