<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
require_once 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $stmt = $conn->prepare("SELECT * FROM recipes WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($recipe = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "recipe" => $recipe]);
    } else {
        echo json_encode(["success" => false, "message" => "Recipe not found"]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid ID"]);
}
$conn->close();
