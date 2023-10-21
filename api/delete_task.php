<?php

// Setup database and set content type to JSON
require_once(__DIR__ . "/../init.php");
header("Content-Type: application/json");

// Redirect if not DELETE method
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "DELETE request is required."],
    ]);
    header("Location: /webprog/uts-lab/index.php");
    exit;
}

// Get task ID and session user
$username = $_SESSION["username"];
$data = json_decode(file_get_contents("php://input"), true);
$task_id = isset($data["taskId"]) ? clean_data($data["taskId"]) : null;
if ($data === null || !$task_id) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "No task specified to delete."],
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
            "scope" => "An error occured while trying to delete task.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}

// Ensure task exists
if (count($result = $stmt->fetch(PDO::FETCH_ASSOC)) === 0) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "Task does not exist."],
    ]);
    return;
}

// Ensure task user is the same as current user
if ($result["username"] !== $username) {
    echo json_encode([
        "ok" => false,
        "error" => ["message" => "User cannot delete other user's tasks."],
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
            "scope" => "An error occured while trying to delete task.",
            "message" => $e->getMessage()
        ],
    ]);
    return;
}
$select_dependent_result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Delete task
try {
    $delete_task_query = "DELETE FROM Task 
                        WHERE id = :task_id";
    $stmt = $pdo->prepare($delete_task_query);
    $stmt->bindParam(":task_id", $task_id, PDO::PARAM_INT);
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

// If a dependent, set all children "Not started"
if (count($select_dependent_result) > 0) {
    foreach ($select_dependent_result as $task) {
        $child_id = $task["id"];
        try {
            $update_child_progress = "UPDATE Task 
                                    SET progress = 'Not started'
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
    "taskProgress" => $result["progress"],
    "error" => "",
]);
