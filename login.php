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
    $password = clean_data($_POST["password"]);

    // Check form data validity
    $valid_username = strlen($username) > 0;
    $valid_password = strlen($password) > 0;
    $valid_form = $valid_username && $valid_password;

    // Proceed to insert data if all is valid
    if ($valid_form) {
        // Successful authentication boolean
        $valid_credentials = true;
        $query_success = true;

        // Check if user exists
        $select_query = "SELECT * FROM User
                        WHERE username = :username";

        try {
            $stmt = $pdo->prepare($select_query);
            $stmt->bindParam(":username", $username);
            $stmt->execute();
        } catch (PDOException $e) {
            $query_success = false;
            $database_error = $e->getMessage();
        }
        $select_result = $stmt->fetch(PDO::FETCH_ASSOC);
        $valid_credentials = $select_result && count($select_result) > 0;

        // Try to login
        if ($query_success && $valid_credentials) {
            $hashed_password = $select_result["password"];
            if ($valid_credentials = password_verify($password, $hashed_password)) {
                $_SESSION["is_authenticated"] = true;
                $_SESSION["username"] = $username;
                header("Location: index.php");
            }
        }
    }
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?= head("Login") ?>
    <script src="static/scripts/login.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar(false, "login") ?>

    <!-- Main -->
    <main class="form-main opacity-0">
        <!-- Form -->
        <form id="loginForm" action="login.php" method="post">
            <!-- Heading -->
            <h1 class="form-header">
                Welcome back!
            </h1>

            <!-- Username -->
            <div class="input-ctr">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" spellcheck="false">
                <?= ($post_req && !$valid_username) ? error_message(empty_error("username"), "username") : "" ?>
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
                <?= ($post_req && !$valid_password) ? error_message(empty_error("password"), "password") : "" ?>
                <a href="forgot-password.php" class="text-link">Forgot password?</a>
            </div>

            <!-- Submit -->
            <button type="submit" class="button-blue">Login</button>

            <!-- Form error message -->
            <?=
            (isset($token_expired_message) || ($post_req && ($valid_form && (!$valid_credentials || !$query_success)))) ?
                ("<div class=\"text-center\">" .
                    error_message(
                        isset($token_expired_message)
                            ? $token_expired_message
                            : (!$valid_credentials
                                ? "Invalid username and/or password."
                                : ERROR["general"]),
                        "form"
                    ) .
                    "</div>"
                ) : ""
            ?>

            <!-- Register redirect -->
            <div class="text-center">
                Don't have an account yet? <a href="register.php" class="text-link">Register here.</a>
            </div>
        </form>
    </main>
</body>

</html>