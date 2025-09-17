<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Show PHP errors for debugging (optional in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Only POST requests allowed"]);
    exit;
}

// Get raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    !isset($data['username']) || !isset($data['email']) ||
    !isset($data['phone']) || !isset($data['password'])
) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$username = trim($data['username']);
$email = trim($data['email']);
$phone = trim($data['phone']);
$password = trim($data['password']);

// Simple validation
if (strlen($username) < 3 || strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

// Connect to MySQL
$servername = "localhost";
$dbUsername = "root";
$dbPassword = "";
$dbName = "tslrd";

$conn = new mysqli($servername, $dbUsername, $dbPassword, $dbName);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Check if username already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Username already taken"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $email, $phone, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed"]);
}

$stmt->close();
$conn->close();
?>

