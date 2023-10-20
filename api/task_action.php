<?php

// Setup database and set content type to JSON
require_once(__DIR__ . "/../init.php");
header("Content-Type: application/json");

// Redirect if not GET method
if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "PUT request is required."],
    ]);
    header("Location: /webprog/uts-lab/index.php");
    exit;
}

// Get session user, action, and task ID
$username = $_SESSION["username"];
$data = json_decode(file_get_contents("php://input"), true);
$task_id = isset($data["taskId"]) ? (int) clean_data($data["taskId"]) : null;
$action = isset($data["action"]) ? clean_data($data["action"]) : null;

// Ensure action and task ID are present in body
if ($data === null || !$task_id || !$action) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "No action or task specified."],
    ]);
    return;
}

// Check if task exists
try {
    $select_task_query = "SELECT * FROM Task 
                        WHERE id = :task_id";
    $stmt = $pdo->prepare($select_task_query);
    $stmt->bindParam(":task_id", $task_id, PDO::PARAM_INT);
    $stmt->execute();
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "error" => [
            "scope" => "An error occured while trying to modify task.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}

// Get result
$select_task_result = $stmt->fetch(PDO::FETCH_ASSOC);

// Ensure task exists
if (!$select_task_result || count($select_task_result) === 0) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "Task does not exist."],
    ]);
    return;
}

// Ensure task user is the same as current user
if ($select_task_result["username"] !== $username) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "User cannot modify other user's tasks."],
    ]);
    return;
}

// Ensure task is not completed
if ($select_task_result["progress"] === "Completed") {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "Completed tasks cannot be altered."],
    ]);
    return;
}

// Ensure task is not dependent if action is toggle
if ($select_task_result["progress"] === "Waiting on" && $action !== "complete") {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "Dependent tasks cannot be toggled."],
    ]);
    return;
}

// Check if task is a dependent
try {
    $select_dependent_query = "SELECT * FROM Task 
                            WHERE dependent_on_id = :task_id";
    $stmt = $pdo->prepare($select_dependent_query);
    $stmt->bindParam(":task_id", $task_id, PDO::PARAM_INT);
    $stmt->execute();
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "error" => [
            "scope" => "An error occured while trying to modify task.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}
$select_dependent_result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Modify task as per specified action
$progress =
    $action === "complete"
    ? "Completed"
    : ($select_task_result["progress"] === "Not started"
        ? "In progress"
        : "Not started");

try {
    $action_query = "UPDATE Task 
                    SET progress = :progress 
                    WHERE id = :task_id";
    $stmt = $pdo->prepare($action_query);
    $stmt->bindParam(":task_id", $task_id, PDO::PARAM_INT);
    $stmt->bindParam(":progress", $progress, PDO::PARAM_STR);
    $stmt->execute();
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "error" => [
            "scope" => "An error occured while trying to modify task.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}

// If a dependent and task is set to completed, set all children "Not started"
if ($progress === "Completed" && count($select_dependent_result) > 0) {
    foreach ($select_dependent_result as $task) {
        $child_id = $task["id"];
        try {
            $update_child_progress = "UPDATE Task 
                                    SET progress = 'Not started', dependent_on_id = NULL
                                    WHERE id = :child_id";
            $stmt = $pdo->prepare($update_child_progress);
            $stmt->bindParam(":child_id", $child_id, PDO::PARAM_INT);
            $stmt->execute();
        } catch (Exception $e) {
            echo json_encode([
                "ok" => false,
                "error" => [
                    "scope" => "An error occured while trying to delete task.",
                    "message" => $e->getMessage()
                ],
            ]);
            return;
        }
    }
}

echo json_encode([
    "ok" => true,
    "error" => "",
]);
