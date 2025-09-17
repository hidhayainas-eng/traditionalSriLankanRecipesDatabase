<?php
// Allow CORS and JSON
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

// Read raw input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput);

// Defensive check
if (!$data) {
    echo json_encode(["success" => false, "message" => "No JSON body received."]);
    exit();
}

if (
    isset($data->recipe_id) &&
    isset($data->rating) &&
    isset($data->review) &&
    isset($data->reviewer_name)
) {
    $recipe_id = intval($data->recipe_id);
    $rating = intval($data->rating);
    $review = mysqli_real_escape_string($conn, $data->review);
    $reviewer_name = mysqli_real_escape_string($conn, $data->reviewer_name);

    $stmt = $conn->prepare("INSERT INTO reviews (recipe_id, rating, review, reviewer_name) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $recipe_id, $rating, $review, $reviewer_name);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save review."]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
}

