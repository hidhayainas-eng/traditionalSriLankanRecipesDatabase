<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit(0);



if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$region = $_POST['region'] ?? '';
$category = $_POST['category'] ?? '';
$ingredients = $_POST['ingredients'] ?? '';
$instructions = $_POST['instructions'] ?? '';

if (!$id || !$name) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$imageName = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageName = uniqid() . "_" . basename($_FILES['image']['name']);
    $targetPath = "../uploads/" . $imageName;
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
        exit;
    }
}

// Build SQL update
$sql = "UPDATE recipes SET name=?, region=?, category=?, ingredients=?, instructions=?";
$params = [$name, $region, $category, $ingredients, $instructions];

if ($imageName) {
    $sql .= ", image=?";
    $params[] = $imageName;
}

$sql .= " WHERE id=?";
$params[] = $id;

$stmt = $conn->prepare($sql);
if ($stmt->execute($params)) {
    echo json_encode(['success' => true, 'message' => 'Recipe updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}
?>

