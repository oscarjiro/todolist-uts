<?php

require_once(__DIR__ . "/init.php");

// Get session username
$username = $_SESSION["username"];

$post_req = $_SERVER["REQUEST_METHOD"] === "POST";
if ($post_req) {
    // Collect POST data
    $name = clean_data($_POST["name"]);
    $description = clean_data($_POST["description"]);
    $date = clean_data($_POST["date"]);
    $progress = clean_data($_POST["progress"]);
    $dependent = isset($_POST["dependentTask"]) ? (int) clean_data($_POST["dependentTask"]) : null;

    // Check form validity
    $valid_name = strlen($name) > 0 && strlen($name) <= TASKNAME_MAX_LENGTH;
    $valid_description = !$description || strlen($description) <= TASKDESC_MAX_LENGTH;
    $valid_date = check_date($date);
    $valid_progress = in_array($progress, TASK_PROGRESS) && $progress !== "Completed";
    $valid_dependent = (!$dependent && $progress !== "Waiting on") || is_int($dependent);

    // Proceed to insert data if all is valid 
    if ($valid_form = $valid_name && $valid_description && $valid_date && $valid_progress && $valid_dependent) {
        // Boolean
        $query_success = true;
        $valid_dependent_task = true;

        // Check if dependent task exists
        if ($dependent) {
            $select_dependent_query = "SELECT * FROM Task 
                                    WHERE id = :dependent_id";
            try {
                $stmt = $pdo->prepare($select_dependent_query);
                $stmt->bindParam(":dependent_id", $dependent, PDO::PARAM_INT);
                $stmt->execute();
            } catch (PDOException $e) {
                $query_success = false;
                $database_error = $e->getMessage();
                $valid_dependent_task = false;
            }
        }

        // If dependent task exists, ensure it is not completed
        $select_dependent_result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (
            $query_success &&
            $valid_dependent_task = (!$dependent ||
                (isset($select_dependent_result["username"]) &&
                    $select_dependent_result["progress"] !== "Completed" &&
                    $select_dependent_result["username"] === $username))
        ) {
            // Insert data
            $insert_query = "INSERT INTO TASK 
                                (username, name, description, todo_date, progress" .
                ($dependent ? ", dependent_on_id" : "") . ")
                            VALUES
                                (:username, :name, :description, :date, :progress" .
                ($dependent ? ", :dependent_id" : "") . ")";
            try {
                $stmt = $pdo->prepare($insert_query);
                $stmt->bindParam(":username", $username, PDO::PARAM_STR);
                $stmt->bindParam(":name", $name, PDO::PARAM_STR);
                $stmt->bindParam(":description", $description, PDO::PARAM_STR);
                $stmt->bindParam(":date", $date, PDO::PARAM_STR);
                $stmt->bindParam(":progress", $progress, PDO::PARAM_STR);
                if ($dependent) {
                    $stmt->bindParam(":dependent_id", $dependent, PDO::PARAM_INT);
                }
                $stmt->execute();
                header("Location: index.php");
            } catch (PDOException $e) {
                $query_success = false;
                $database_error = $e->getMessage();
            }
        }
    }
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?= head() ?>
    <script src="static/scripts/add.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar() ?>

    <!-- Main -->
    <main class="form-main opacity-0">
        <!-- Form -->
        <form id="addForm" action="add.php" method="post">
            <!-- Heading -->
            <h1 class="form-header">
                Add a new task.
            </h1>

            <!-- Name -->
            <div class="input-ctr">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" spellcheck="false">
                <?= ($post_req && !$valid_name) ? error_message(is_empty($name) ? empty_error("task name") : ERROR["task_name"], "name") : "" ?>
            </div>

            <!-- Description -->
            <div class="input-ctr space-y-3">
                <label for="description">Description <span class="text-optional">Optional</span></label>
                <div id="descriptionContainer" class="relative">
                    <textarea name="description" id="description" rows="3" spellcheck="false"></textarea>
                    <div class="textarea-counter"><span id="textareaCount">0</span>/<?= TASKDESC_MAX_LENGTH ?></div>
                </div>
                <?= ($post_req && !$valid_description) ? error_message(ERROR["task_description"], "description") : "" ?>
            </div>

            <!-- Todo Date -->
            <div class="input-ctr">
                <label for="date">Todo Date</label>
                <input type="date" id="date" name="date">
                <?= ($post_req && !$valid_date) ? error_message(is_empty($date) ? empty_error("to-do date") : ERROR["task_date"], "date") : "" ?>
            </div>

            <!-- Current Progress -->
            <div class="input-ctr">
                <label for="date">Current Progress</label>
                <div id="progressChoices" class="input-progress-choices-ctr">
                    <?php
                    foreach (TASK_PROGRESS as $progress) {
                        if ($progress !== "Completed") {
                    ?>
                            <button id="<?= to_camel_case($progress) ?>Progress" type="button" data-progress="<?= $progress ?>" class="button-gray<?= $progress === "Not started" ? "-active" : "" ?>">
                                <?= $progress ?>
                            </button>
                    <?php
                        }
                    }
                    ?>
                </div>
                <input type="text" id="progress" name="progress" class="hidden" value="Not started">
                <?= ($post_req && !$valid_progress) ? error_message(is_empty($progress) ? empty_error("task progress") : ERROR["task_progress"], "progress") : "" ?>
            </div>

            <!-- Dependent Task -->
            <div id="dependentTaskInputContainer" class="input-ctr hidden opacity-0">
                <label for="dependentTask">Dependent Task</label>
                <select name="dependentTask" id="dependentTask">
                    <option disabled selected>Select a task to wait on</option>
                </select>
                <?= ($post_req && (!$valid_dependent || ($valid_form && !$valid_dependent_task))) ? error_message(is_empty($dependent) ? empty_error("task dependent") : ERROR["task_dependent"], "dependentTask") : "" ?>
            </div>


            <!-- Submit -->
            <button type="submit" class="button-blue">Add task</button>

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