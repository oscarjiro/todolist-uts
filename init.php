<?php

// Require dependencies
require_once(__DIR__ . "/config.php");
require_once(__DIR__ . "/utils.php");
require_once(__DIR__ . "/components.php");

// Start session
session_start();

// Get current route
$route = get_route();

// Reject access to this route
if ($route === "init.php") {
    header("Location: index.php");
}

// Connect to MySQL server
try {
    $pdo = new PDO("mysql:host=" . DB_HOST, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "An error occured during connecting to database server.";
    return;
}

// Checking database existence
try {
    // Check if database exists
    $check_db_query = "SELECT SCHEMA_NAME 
                    FROM INFORMATION_SCHEMA.SCHEMATA
                    WHERE SCHEMA_NAME = :db_name";
    $stmt = $pdo->prepare($check_db_query);
    $stmt->bindValue(":db_name", DB_NAME, PDO::PARAM_STR);
    $stmt->execute();
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "An error occured during setting up database.";
    return;
}

// Create database if it does not exist
try {
    if (!$db_exists = $stmt->rowCount() > 0) {
        $create_db_query = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
        $stmt = $pdo->prepare($create_db_query);
        $stmt->execute();
    }
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "creating database";
    return;
}

// Reconnect to the database
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USERNAME, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "An error occured during connecting to database.";
    return;
}

// Create table User if it does not exist
try {
    $create_user_query = "CREATE TABLE IF NOT EXISTS User (
                            username VARCHAR(" . USERNAME_MAX_LENGTH . ") PRIMARY KEY NOT NULL,
                            email VARCHAR(" . EMAIL_MAX_LENGTH . ") NOT NULL,
                            password VARCHAR(255) NOT NULL,
                            reset_token_hash VARCHAR(64) UNIQUE,
                            reset_token_expires_at DATETIME,
                            CONSTRAINT validate_username CHECK (
                                username REGEXP :username_regexp
                            ),
                            CONSTRAINT validate_email CHECK (
                                email REGEXP :email_regexp
                            )
                        )";
    $stmt = $pdo->prepare($create_user_query);
    $stmt->bindValue(":username_regexp", trim(USERNAME_REGEXP, "/"), PDO::PARAM_STR);
    $stmt->bindValue(":email_regexp", trim(EMAIL_REGEXP, "/"), PDO::PARAM_STR);
    $stmt->execute();
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "An error occured during creating table User.";
    return;
}

// Create table Task
try {
    $valid_progress_list = array_map(function ($progress) {
        return "'$progress'";
    }, TASK_PROGRESS);
    $valid_progress_string = implode(", ", $valid_progress_list);
    $create_task_query = "CREATE TABLE IF NOT EXISTS Task (
                            id INTEGER PRIMARY KEY AUTO_INCREMENT,
                            username VARCHAR(" . USERNAME_MAX_LENGTH . ") NOT NULL,
                            name VARCHAR(" . TASKNAME_MAX_LENGTH . ") NOT NULL,
                            description VARCHAR(" . TASKDESC_MAX_LENGTH . "),
                            progress VARCHAR(20) NOT NULL DEFAULT 'Not started' CHECK (progress IN (" . $valid_progress_string . ")),
                            todo_date DATE NOT NULL,
                            dependent_on_id INTEGER,
                            CONSTRAINT fk_task_user FOREIGN KEY (username) REFERENCES User (username) ON DELETE CASCADE,
                            CONSTRAINT fk_task_dependency FOREIGN KEY (dependent_on_id) REFERENCES Task (id) ON DELETE SET NULL,
                            CHECK (
                                (progress <> 'Waiting on' AND dependent_on_id IS NULL)
                                OR
                                (progress = 'Waiting on' AND dependent_on_id IS NOT NULL)
                            )
                        )";
    $stmt = $pdo->prepare($create_task_query);
    $stmt->execute();
} catch (PDOException $e) {
    redirect_error();
    $error_scope = "An error occured during creating table Task.";
    return;
}

// Throw to login if not authenticated
if (!$is_authenticated = is_authenticated()) logout();

// Otherwise, ensure user exists
else {
    try {
        $check_user_query = "SELECT * FROM User
                            WHERE username = :username";
        $stmt = $pdo->prepare($check_user_query);
        $stmt->bindParam(":username", $_SESSION["username"], PDO::PARAM_STR);
        $stmt->execute();
    } catch (PDOException $e) {
        redirect_error();
        $error_scope = "An error occured during authenticating user.";
        return;
    }

    // If user does not exist, throw to login
    if ($stmt->rowCount() === 0) logout();
}
