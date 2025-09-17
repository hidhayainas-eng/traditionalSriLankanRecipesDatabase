<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$recipeId = $data['recipeId'] ?? null;

if ($recipeId === null) {
    echo json_encode(["success" => false, "message" => "Missing recipeId"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM recipes WHERE id = ?");
$stmt->bind_param("i", $recipeId);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Recipe rejected and deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to reject recipe"]);
}

$stmt->close();
$conn->close();
?>
