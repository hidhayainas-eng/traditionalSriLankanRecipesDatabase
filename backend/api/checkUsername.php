<?php
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"]);

if (!$username || strlen($username) < 3) {
    echo json_encode(["available" => false, "message" => "Invalid username"]);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["available" => false, "message" => "Username is already taken"]);
} else {
    echo json_encode(["available" => true, "message" => "Username is available"]);
}

$stmt->close();
$conn->close();
