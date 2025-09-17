<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
include 'db.php';

$sql = "SELECT * FROM recipes WHERE featured = 1 AND status = 'approved' ORDER BY id DESC LIMIT 6";
$result = $conn->query($sql);

$recipes = [];
while ($row = $result->fetch_assoc()) {
    $recipes[] = $row;
}

echo json_encode([
  "success" => true,
  "recipes" => $recipes
]);

$conn->close();
