<?php

require_once(__DIR__ . "/init.php");

if (is_authenticated()) {
    header("Location: index.php");
    exit;
}

$post_req = $_SERVER["REQUEST_METHOD"] === "POST";
if ($post_req) {
    // Collect POST data
    $username = clean_data($_POST["username"]);
    $email = clean_data($_POST["email"]);
    $password = clean_data($_POST["password"]);
    $confirm_password = clean_data($_POST["confirmPassword"]);

    // Check form validity
    $valid_username = preg_match(USERNAME_REGEXP, $username);
    $valid_email = strlen($email) > 0 && strlen($email) <= EMAIL_MAX_LENGTH && preg_match(EMAIL_REGEXP, $email);
    $valid_password = preg_match(PASSWORD_REGEXP, $password);
    $valid_confirm_password = $password === $confirm_password;

    // Proceed to insert data if all is valid
    if ($valid_form = $valid_email && $valid_username && $valid_password && $valid_confirm_password) {
        // Boolean
        $user_exists = false;
        $query_success = true;

        // Check if user exists
        $select_query = "SELECT * FROM User
                        WHERE username = :username";
        try {
            $stmt = $pdo->prepare($select_query);
            $stmt->bindParam(":username", $username, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            $query_success = false;
            $database_error = $e->getMessage();
        }

        // If user does not exist yet, insert user to database
        if (!$user_exists = $query_success && ($select_result = $stmt->fetch(PDO::FETCH_ASSOC))) {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $insert_query = "INSERT INTO User (username, email, password)
                            VALUES (:username, :email, :password)";
            try {
                $stmt = $pdo->prepare($insert_query);
                $stmt->bindParam(":username", $username, PDO::PARAM_STR);
                $stmt->bindParam(":email", $email, PDO::PARAM_STR);
                $stmt->bindParam(":password", $hashed_password, PDO::PARAM_STR);
                $stmt->execute();
                $_SESSION["is_authenticated"] = true;
                $_SESSION["username"] = $username;
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
    <?= head("Register") ?>
    <script src="static/scripts/register.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar(false, "register") ?>

    <!-- Main -->
    <main class="form-main opacity-0">
        <!-- Form -->
        <form id="registerForm" action="register.php" method="post">
            <!-- Heading -->
            <h1 class="form-header">
                Sign up to get started.
            </h1>

            <!-- Username -->
            <div class="input-ctr">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" spellcheck="false">
                <?= ($post_req && (!$valid_username || $user_exists)) ? error_message(!$valid_username ? (is_empty($username) ? empty_error("username") : ERROR["username"]) : "Username already exists.", "username") : "" ?>
            </div>

            <!-- Email -->
            <div class="input-ctr">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" spellcheck="false">
                <?= ($post_req && !$valid_email) ? error_message(is_empty($email) ? empty_error("email") : ERROR["email"], "email") : "" ?>
            </div>

            <!-- Password -->
            <div class="input-ctr">
                <label for="password">Password</label>
                <div id="passwordInput" class="input-password-ctr">
                    <input type="password" id="password" name="password" spellcheck="false" class="w-full border-none">
                    <div id="toggleViewPassword" class="input-password-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>
                <?= ($post_req && !$valid_password) ? error_message(is_empty($password) ? empty_error("password") : ERROR["password"], "password") : "" ?>
            </div>

            <!-- Confirm password -->
            <div class="input-ctr">
                <label for="confirmPassword">Confirm Password</label>
                <div id="confirmPasswordInput" class="input-password-ctr">
                    <input type="password" id="confirmPassword" name="confirmPassword" spellcheck="false" class="w-full border-none">
                    <div id="toggleViewConfirmPassword" class="input-password-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>
                <?= ($post_req && !$valid_confirm_password) ? error_message(ERROR["confirm_password"], "confirmPassword") : "" ?>
            </div>

            <!-- Submit button -->
            <button type="submit" class="button-blue">Register</button>

            <!-- Form error message -->
            <?=
            ($post_req && $valid_form && !$query_success) ?
                ("<div class=\"text-center\">" .
                    error_message(ERROR["general_db"], "form") .
                    "</div>"
                ) : ""
            ?>

            <!-- Login redirect -->
            <div class="text-center">
                Already have an account? <a href="login.php" class="text-link">Login here.</a>
            </div>
        </form>
    </main>
</body>

</html>