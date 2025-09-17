import { useState } from "react";
import "../styles/submit.css";

const Submit = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    let response; // ✅ Declare response outside try block

    try {
      response = await fetch("http://localhost/tslrd/backend/api/submit.php", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.success) {
          form.reset();
          setSuccessMessage(data.message || "Recipe submitted successfully!");
          setErrorMessage(null);
          setTimeout(() => setSuccessMessage(null), 5000);
        } else {
          setErrorMessage(data.message || "Something went wrong.");
          setSuccessMessage(null);
        }
      } else {
        const text = await response.text();
        throw new Error("Expected JSON response, got:\n" + text);
      }
    } catch (error) {
      let rawResponse = "";
      if (response) {
        try {
          rawResponse = await response.text();
        } catch (_) {
          rawResponse = error.message;
        }
      } else {
        rawResponse = error.message;
      }

      console.error("Raw server response:", rawResponse);
      setErrorMessage("Unexpected error occurred. Server said: " + rawResponse);
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-page">
      <header className="submit-header">Submit Your Recipe</header>

      <div className="form-container">
        <form
          id="recipe-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          noValidate
        >
          <label htmlFor="name">Recipe Name:</label>
          <input type="text" id="name" name="name" required autoFocus />

          <label htmlFor="region">Region (e.g., Southern, Central):</label>
          <input type="text" id="region" name="region" />

          <label htmlFor="category">Category:</label>
          <select id="category" name="category">
            <option value="Staples">Staples</option>
            <option value="Curries">Curries</option>
            <option value="Desserts">Desserts</option>
            <option value="Snacks">Snacks</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="ingredients">Ingredients:</label>
          <textarea id="ingredients" name="ingredients" rows="5"></textarea>

          <label htmlFor="instructions">Instructions:</label>
          <textarea id="instructions" name="instructions" rows="5"></textarea>

          <label htmlFor="image">Upload Image (optional):</label>
          <input type="file" id="image" name="image" accept="image/*" />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>

        {successMessage && (
          <div className="success-message" role="alert">
            ✅ <strong>{successMessage}</strong>
          </div>
        )}

        {errorMessage && (
          <div className="error-message" role="alert">
            ❌ <strong>{errorMessage}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submit;
