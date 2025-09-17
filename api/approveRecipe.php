<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db.php';

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

$response = ['success' => false];

if (isset($data['recipeId'])) {
    $recipeId = intval($data['recipeId']);

    $stmt = $conn->prepare("UPDATE recipes SET status = 'approved' WHERE id = ?");
    $stmt->bind_param("i", $recipeId);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Recipe approved successfully.";
    } else {
        $response['message'] = "Database error. Could not approve recipe.";
    }

    $stmt->close();
} else {
    $response['message'] = "Invalid input. 'recipeId' is required.";
}

$conn->close();
echo json_encode($response);


