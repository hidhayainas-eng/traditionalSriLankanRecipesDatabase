import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/viewRecipe.css";

function ViewRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState(""); // NEW: reviewer name
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);

  // Wrap fetchReviews in useCallback so reference is stable
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost/tslrd/backend/api/getReviews.php?recipe_id=${id}`
      );
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [id]);

  // Wrap fetchAverageRating in useCallback so reference is stable
  const fetchAverageRating = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost/tslrd/backend/api/getAverageRating.php?recipe_id=${id}`
      );
      const data = await res.json();
      setAverageRating(data);
    } catch {
      console.error("Failed to fetch average rating.");
    }
  }, [id]);

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

    fetchReviews();
    fetchAverageRating();
  }, [id, fetchReviews, fetchAverageRating]);

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    if (!reviewerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/tslrd/backend/api/submitReview.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipe_id: id,
            rating: parseInt(rating),
            review: reviewText,
            reviewer_name: reviewerName,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        setRating(0);
        setReviewText("");
        setReviewerName("");
        fetchReviews();
        fetchAverageRating();
      } else {
        alert("Failed to submit review.");
      }
    } catch {
      alert("Network error. Try again later.");
    }
  };

  const renderStars = (count) => {
    const filled = "★".repeat(count);
    const empty = "☆".repeat(5 - count);
    return filled + empty;
  };

  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="view-recipe-container">
      <h1>{recipe.name}</h1>
      <img
        src={`http://localhost/tslrd/backend/uploads/${recipe.image}`}
        alt={recipe.name}
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

      <hr />
      <div className="reviews-section">
        <h2>Ratings & Reviews</h2>

        {averageRating && (
          <p>
            <strong>Average Rating:</strong>{" "}
            <span className="stars">
              {renderStars(Math.round(averageRating.average_rating))}
            </span>{" "}
            ({averageRating.review_count} reviews)
          </p>
        )}

        <div className="review-form">
          <label>
            Your Name:
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
          <br />
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>Select</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </label>
          <br />
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            cols={50}
          />
          <br />
          <button onClick={handleSubmitReview}>Submit Review</button>
        </div>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="review-item">
                <p>
                  <strong>{r.reviewer_name}</strong> –{" "}
                  <span className="stars">{renderStars(r.rating)}</span>
                </p>
                <p>{r.review}</p>
                <small>{new Date(r.created_at).toLocaleString()}</small>
                <hr />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="back-link-container">
        <Link to="/recipes" className="back-link">
          &larr; Back to Recipes
        </Link>
      </div>
    </div>
  );
}

export default ViewRecipe;
