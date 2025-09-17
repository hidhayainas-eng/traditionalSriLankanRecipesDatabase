<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $region = $_POST['region'] ?? '';
    $category = $_POST['category'] ?? '';
    $ingredients = $_POST['ingredients'] ?? '';
    $instructions = $_POST['instructions'] ?? '';
    $status = 'approved'; // ✅ since this is an admin submission

    $imagePath = "";
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = "../../uploads/";
        $filename = time() . "_" . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            $imagePath = "uploads/" . $filename;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload image."]);
            exit;
        }
    }

    $stmt = $conn->prepare("INSERT INTO recipes (name, region, category, ingredients, instructions, image, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $name, $region, $category, $ingredients, $instructions, $imagePath, $status);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
