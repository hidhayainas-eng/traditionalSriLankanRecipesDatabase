<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

include 'db.php';

$recipe_id = $_GET['recipe_id'];

$sql = "SELECT ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS review_count FROM reviews WHERE recipe_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $recipe_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_assoc());
$conn->close();
?>
