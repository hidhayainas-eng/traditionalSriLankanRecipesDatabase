<?php
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$result = $conn->query("SELECT * FROM recipes WHERE status = 'approved' ORDER BY created_at DESC");

$recipes = [];
while ($row = $result->fetch_assoc()) {
    $recipes[] = $row;
}

echo json_encode(["success" => true, "recipes" => $recipes]);
$conn->close();






