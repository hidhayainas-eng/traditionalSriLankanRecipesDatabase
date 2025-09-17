
<?php
require 'db.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data["username"], $data["password"])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$username = $data["username"];
$password = $data["password"];

// Function to verify user in table
function verifyUser($conn, $table, $username, $password) {
    $stmt = $conn->prepare("SELECT username, password FROM $table WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user["password"])) {
            return true;
        }
    }

    return false;
}

// Check admins table
if (verifyUser($conn, "admins", $username, $password)) {
    echo json_encode(["success" => true, "role" => "admin", "username" => $username]);
    $conn->close();
    exit;
}

// Check users table
if (verifyUser($conn, "users", $username, $password)) {
    echo json_encode(["success" => true, "role" => "user", "username" => $username]);
    $conn->close();
    exit;
}

// If not found
echo json_encode(["success" => false, "message" => "User not found"]);
$conn->close();
?>
