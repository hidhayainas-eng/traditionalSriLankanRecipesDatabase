<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS and JSON headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db.php'; // ✅ Make sure this path is correct

$response = ['success' => false];

// Check POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

// Get input fields
$name = $_POST['name'] ?? '';
$region = $_POST['region'] ?? '';
$category = $_POST['category'] ?? '';
$ingredients = $_POST['ingredients'] ?? '';
$instructions = $_POST['instructions'] ?? '';
$imageName = null;

// Basic validation
if (empty($name)) {
    echo json_encode(["success" => false, "message" => "Recipe name is required."]);
    exit;
}

// Upload image (optional)
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $imageName = time() . '_' . basename($_FILES['image']['name']);
    $imagePath = $uploadDir . $imageName;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
        echo json_encode(["success" => false, "message" => "Image upload failed."]);
        exit;
    }
}

// Save to DB
$stmt = $conn->prepare("INSERT INTO recipes (name, region, category, ingredients, instructions, image, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssssss", $name, $region, $category, $ingredients, $instructions, $imageName);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Recipe submitted successfully! Awaiting admin approval."]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();

