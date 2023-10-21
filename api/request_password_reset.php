<?php

// Setup database and set content type to JSON
require_once(__DIR__ . "/../init.php");
header("Content-Type: application/json");

// Redirect if not POST method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "POST request is required."],
    ]);
    header("Location: /webprog/uts-lab/index.php");
    exit;
}

// Get posted email
$email = isset($_POST["email"]) ? clean_data($_POST["email"]) : null;
if (!$email) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "No email specified."],
    ]);
    return;
}

// Check if user with email exists
$select_query = "SELECT * FROM User
                WHERE email = :email";
try {
    $stmt = $pdo->prepare($select_task_query);
    $stmt->bindParam(":email", $email, PDO::PARAM_STR);
    $stmt->execute();
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "error" => [
            "scope" => "An error occured. Please try again.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}

// If user does not exist, simply return with no problem
$result = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$result || count($result) === 0) {
    echo json_encode([
        "ok" => true,
        "error" => "",
    ]);
    return;
}

// Update the user
