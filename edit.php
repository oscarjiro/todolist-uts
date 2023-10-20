<?php

require_once(__DIR__ . "/init.php");

// Get session username and task ID parameter
$username = $_SESSION["username"];
$param_task_id = isset($_GET["id"]) ? (int) clean_data($_GET["id"]) : null;

// If no task ID specified, return to index
if (!$param_task_id) {
    header("Location: index.php");
    exit;
}

// Get task details
$select_query = "SELECT * FROM Task
                WHERE id = :task_id
                AND username = :username";
try {
    $stmt = $pdo->prepare($select_query);
    $stmt->bindParam(":task_id", $param_task_id, PDO::PARAM_INT);
    $stmt->bindParam(":username", $username, PDO::PARAM_STR);
    $stmt->execute();
} catch (PDOException $e) {
    header("Location: index.php");
    exit;
}

// If successful, get result
$select_result = $stmt->fetch(PDO::FETCH_ASSOC);
$original_name = $select_result["name"];
$original_date = $select_result["todo_date"];
$original_description = $select_result["description"];

$post_req = $_SERVER["REQUEST_METHOD"] === "POST";
if ($post_req) {
    // Collect POST data
    $name = clean_data($_POST["name"]);
    $date = clean_data($_POST["date"]);
    $description = $_POST["description"] ? clean_data($_POST["description"]) : null;

    // Check form validity
    $valid_name = strlen($name) > 0 && strlen($name) <= TASKNAME_MAX_LENGTH;
    $valid_date = check_date($date);
    $valid_description = !$description || strlen($description) <= TASKDESC_MAX_LENGTH;
    $valid_form = $valid_name && $valid_description && $valid_date;

    // Proceed to update data if all is valid 
    if ($valid_form) {
        // Boolean
        $query_success = true;
        $valid_dependent_task = true;

        // Update data
        $insert_query = "UPDATE Task
                            SET name = :name,
                            todo_date = :date,
                            description = :description
                        WHERE
                            username = :username
                            AND id = :task_id";
        try {
            $stmt = $pdo->prepare($insert_query);
            $stmt->bindParam(":name", $name, PDO::PARAM_STR);
            $stmt->bindParam(":date", $date, PDO::PARAM_STR);
            $stmt->bindParam(":description", $description, PDO::PARAM_STR);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR);
            $stmt->bindParam(":task_id", $param_task_id, PDO::PARAM_INT);
            $stmt->execute();
            header("Location: index.php");
        } catch (PDOException $e) {
            $query_success = false;
            $database_error = $e->getMessage();
        }
    }
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?= head("Edit task \"$original_name\"") ?>
    <script src="static/scripts/edit.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar() ?>

    <!-- Main -->
    <main class="form-main opacity-0">
        <!-- Form -->
        <form id="editForm" action="edit.php?id=<?= $param_task_id ?>" method="post">
            <!-- Heading -->
            <h1 class="form-header">
                Edit task <u class="font-light glow"><?= $original_name ?></u>.
            </h1>

            <!-- Name -->
            <div class="input-ctr">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" spellcheck="false" value="<?= $original_name ?>">
                <?= ($post_req && !$valid_name) ? error_message(is_empty($name) ? empty_error("task name") : ERROR["task_name"], "name") : "" ?>
            </div>

            <!-- Todo Date -->
            <div class="input-ctr">
                <label for="date">Todo Date</label>
                <input type="date" id="date" name="date" value="<?= $original_date ?>">
                <?= ($post_req && !$valid_date) ? error_message(is_empty($date) ? empty_error("to-do date") : ERROR["task_date"], "date") : "" ?>
            </div>

            <!-- Description -->
            <div class="input-ctr space-y-3">
                <label for="description">Description <span class="text-optional">Optional</span></label>
                <div id="descriptionContainer" class="relative">
                    <textarea name="description" id="description" rows="3" spellcheck="false"><?= $original_description ?></textarea>
                    <div class="textarea-counter"><span id="textareaCount"><?= strlen($original_description) ?></span>/<?= TASKDESC_MAX_LENGTH ?></div>
                </div>
                <?= ($post_req && !$valid_description) ? error_message(ERROR["task_description"], "description") : "" ?>
            </div>

            <!-- Submit -->
            <button type="submit" class="button-blue">Edit task</button>

            <!-- Form error message -->
            <?=
            ($post_req && $valid_form && !$query_success) ?
                ("<div class=\"text-center\">" .
                    error_message(ERROR["general"], "form") .
                    "</div>"
                ) : ""
            ?>
        </form>
    </main>
</body>