<?php

require_once(__DIR__ . "/init.php");

if (is_authenticated()) {
    header("Location: index.php");
    exit;
}

$post_req = $_SERVER["REQUEST_METHOD"] === "POST";

/*
if ($post_req) {
    // Collect POST data
    $email = clean_data($_POST["email"]);

    // Check form data validity
    $valid_email = strlen($email) > 0 && preg_match(EMAIL_REGEXP, $email);

    // Proceed to insert data if all is valid
    if ($email) {
        // Successful authentication boolean
        $query_success = true;

        // Check if user exists
        $select_query = "SELECT * FROM User
                        WHERE email = :email";

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
*/
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <?= head("Forgot Password") ?>
    <script src="static/scripts/forgotPassword.js" type="module"></script>
</head>

<body>
    <!-- Navbar -->
    <?= navbar(false, "login") ?>

    <!-- Main -->
    <main class="form-main opacity-0">
        <!-- Form -->
        <form id="forgotPasswordForm" action="forgot_password.php" method="post">
            <!-- Heading -->
            <h1 class="form-header">
                Forgot your password?
            </h1>

            <!-- Email -->
            <div class="input-ctr">
                <label for="email">Email</label>
                <input type="text" id="email" name="email" spellcheck="false">
                <?= ($post_req && !$valid_email) ? error_message(is_empty($email) ? empty_error("email") : ERROR["email"], "email") : "" ?>
            </div>

            <!-- Submit -->
            <button type="submit" class="button-blue">Reset Password</button>

            <!-- Form error message -->
            <?=
            ($post_req && $valid_email && !$query_success) ?
                ("<div class=\"text-center\">" .
                    error_message(ERROR["general_db"], "form") .
                    "</div>"
                ) : ""
            ?>

            <!-- Register redirect -->
            <div class="text-center">
                <a href="login.php" class="text-link">Back to login</a>
            </div>
        </form>
    </main>
</body>

</html>