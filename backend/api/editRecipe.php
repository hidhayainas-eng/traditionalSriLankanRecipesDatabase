<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

if (!isset($_POST["id"]) || !isset($_POST["name"])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$id = $_POST["id"];
$name = $_POST["name"];
$region = $_POST["region"] ?? "";
$category = $_POST["category"] ?? "";
$ingredients = $_POST["ingredients"] ?? "";
$instructions = $_POST["instructions"] ?? "";

$imageName = null;

// Fetch old image
$oldImage = "";
$stmt = $conn->prepare("SELECT image FROM recipes WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($oldImage);
$stmt->fetch();
$stmt->close();

// Handle image upload if a new one is provided
if (!empty($_FILES["image"]["name"])) {
    $targetDir = "../uploads/";
    $imageName = uniqid() . "_" . basename($_FILES["image"]["name"]);
    $targetFilePath = $targetDir . $imageName;

    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
        echo json_encode(["success" => false, "message" => "Image upload failed"]);
        exit;
    }

    // Delete old image if exists
    if (!empty($oldImage)) {
        $oldImagePath = $targetDir . $oldImage;
        if (file_exists($oldImagePath)) {
            unlink($oldImagePath);
        }
    }

    // Update with new image
    $sql = "UPDATE recipes SET name=?, region=?, category=?, ingredients=?, instructions=?, image=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssi", $name, $region, $category, $ingredients, $instructions, $imageName, $id);
} else {
    // Update without image
    $sql = "UPDATE recipes SET name=?, region=?, category=?, ingredients=?, instructions=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssi", $name, $region, $category, $ingredients, $instructions, $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed"]);
}
?>

