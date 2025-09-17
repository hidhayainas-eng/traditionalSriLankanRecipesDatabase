<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
include 'db.php';

// Fetch average rating for each recipe, join with recipe info
$sql = "
    SELECT r.*, AVG(rv.rating) AS avg_rating
    FROM recipes r
    LEFT JOIN reviews rv ON r.id = rv.recipe_id
    WHERE r.status = 'approved'
    GROUP BY r.id
    ORDER BY avg_rating DESC
    LIMIT 6
";


$result = $conn->query($sql);
$recipes = [];

while ($row = $result->fetch_assoc()) {
    $row['avg_rating'] = round($row['avg_rating'], 1); // round to 1 decimal
    $recipes[] = $row;
}

echo json_encode([
    "success" => true,
    "recipes" => $recipes
]);

$conn->close();
