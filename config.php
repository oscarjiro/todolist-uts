<?php

// Reject access to this route
$route = basename($_SERVER["PHP_SELF"]);
if ($route === "config.php") {
    header("Location: index.php");
}

// Database 
define("DB_NAME", "todolistdb_utslab_group3");
define("DB_HOST", "localhost");
define("DB_USERNAME", "root");
define("DB_PASSWORD", "");

// User constraints
define("USERNAME_MIN_LENGTH", 5);
define("USERNAME_MAX_LENGTH", 25);
define("USERNAME_REGEXP", "/^(?!.*[.]{2,})[a-z\d_\.]{" . (USERNAME_MIN_LENGTH - 1) . "," . (USERNAME_MAX_LENGTH - 1) . "}[a-z\d_]$/");
define("PASSWORD_MIN_LENGTH", 8);
define("PASSWORD_REGEXP", "/^(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#\$%^&*()_\-+={[}\]|:;\"'<,>.?\/]).{" . PASSWORD_MIN_LENGTH . ",}$/");
define("EMAIL_MAX_LENGTH", 255);
define("EMAIL_REGEXP", "/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/");

// Task constraints
define("TASKNAME_MAX_LENGTH", 50);
define("TASKDESC_MAX_LENGTH", 150);
define("TASK_PROGRESS", ["Not started", "Waiting on", "In progress", "Completed"]);
define("TASK_TODODATE_REGEXP", "/^\d{4}-\d{2}-\d{2}$/");

// Error array
define("ERROR", [
    "username" => "Username must be between " . USERNAME_MIN_LENGTH . " and " . USERNAME_MAX_LENGTH . " characters inclusive and can only contain alphabets, numbers, underscores, and periods.",
    "email" => "Please provide a valid email address.",
    "password" => "Password must be at least " . PASSWORD_MIN_LENGTH . " characters and must contain at least one uppercase letter, number, and special character.",
    "confirm_password" => "Password does not match.",
    "task_name" => "Task name must be at most " . TASKNAME_MAX_LENGTH . " characters long.",
    "task_description" => "Task description must be at most " . TASKDESC_MAX_LENGTH . " characters long.",
    "task_progress" => "Invalid task progress.",
    "task_date" => "To-do date cannot be in the past.",
    "task_dependent" => "Selected task is invalid or does not exist.",
    "general" => "An error occured. Please try again.",
]);
