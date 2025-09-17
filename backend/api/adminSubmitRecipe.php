<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // adjust to your frontend URL
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Use json_decode to parse JSON body
    $input = json_decode(file_get_contents("php://input"), true);

    $name = $input['name'] ?? '';
    $region = $input['region'] ?? null;
    $category = $input['category'] ?? null;
    $ingredients = $input['ingredients'] ?? null;
    $instructions = $input['instructions'] ?? null;
    $imagePath = $input['image'] ?? ''; // admin can send image filename if uploaded separately or null

    // If you want to support image upload here, you'd handle $_FILES similarly to user submit script
    // But typically admin can upload image separately or provide URL

    if (empty($name) || empty($ingredients) || empty($instructions)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, ingredients, and instructions are required']);
        exit;
    }

    $status = 'approved'; // Admin recipes are auto-approved

    $stmt = $conn->prepare("INSERT INTO recipes (name, region, category, ingredients, instructions, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $name, $region, $category, $ingredients, $instructions, $imagePath, $status);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Recipe added and approved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
