<?php

// Setup database and set content type to JSON
require_once(__DIR__ . "/../init.php");
header("Content-Type: application/json");

// Redirect if not GET method
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    header("Location: /webprog/uts-lab/index.php");
    exit;
}

// Get all tasks
try {
    $select_all_tasks_query = "SELECT 
                                T1.id AS id,
                                T1.username AS username,
                                T1.name AS name,
                                T1.progress AS progress,
                                T1.todo_date AS todo_date,
                                T1.description AS description,
                                T2.name AS dependent_name
                            FROM 
                                Task AS T1 
                                LEFT JOIN Task AS T2
                                ON T1.dependent_on_id = T2.id
                            WHERE 
                                T1.username = :username
                            ORDER BY 
                                CASE 
                                    WHEN T1.progress = 'Completed' THEN 1
                                    ELSE 0
                                END, T1.todo_date";

    $stmt = $pdo->prepare($select_all_tasks_query);
    $stmt->bindParam(":username", $_SESSION["username"], PDO::PARAM_STR);
    $stmt->execute();
} catch (Exception $e) {
    $error_scope = "An error occured while trying to retrieve tasks.";
}

// Fetch all results
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON data
echo json_encode([
    "ok" => $successful_query = !isset($e) && !isset($error_scope),
    "result" => $result,
    "error" => $successful_query
        ? ""
        : [
            "scope" => $error_scope,
            "message" => $e->getMessage()
        ]
]);
