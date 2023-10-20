<?php

require_once(__DIR__ . "/config.php");

// Reject access to this route
$route = basename($_SERVER["PHP_SELF"]);
if ($route === "components.php") {
    header("Location: index.php");
}

function icon($class)
{
    return "
        <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"$class\">
            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10\" />
        </svg>
    ";
}

function head($title = null)
{
    return "
        <meta charset=\"UTF-8\">
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <title>todo." . ($title ? " | $title" : "") . "</title>
        <link rel=\"icon\" type=\"image/svg+xml\" href=\"static/favicon.svg\">
        <link rel=\"stylesheet\" href=\"static/styles/styles.css\">
        <script src=\"https://code.jquery.com/jquery-3.7.1.js\" integrity=\"sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=\" crossorigin=\"anonymous\"></script>
    ";
}

function navbar($authenticated = true, $active = null)
{
    return "
        <nav>
            <a href=\"index.php\">
                <div class=\"nav-logo-ctr group\">
                    " . icon("nav-logo-icon") . "
                    <div class=\"nav-logo-text\">
                        todo.
                    </div>
                </div>
            </a>
            <div class=\"nav-link-ctr\">
                " . ($authenticated
        ? ("
                <a href=\"logout.php\" class=\"nav-link\">
                    Logout  
                </a>
        ") : ("
                <a href=\"login.php\" class=\"nav-link " . ($active === "login" ? "opacity-100" : "") . "\">
                    Login
                </a>
                <a href=\"register.php\" class=\"nav-link " . ($active === "register" ? "opacity-100" : "") . "\">
                    Register
                </a>
        ")) . "
            </div>
        </nav>
    ";
}

function error_message($message, $id)
{
    return "
        <div id=\"{$id}ErrorMessage\" class=\"error-msg\">
            $message
        </div>
    ";
}

function system_error($message, $scope = null)
{
    return "
        <div class=\"database-error\">
            <div class=\"text-invalid\">" .
        ($scope ? $scope : ERROR["general"]) .
        "</div>
            <div class=\"database-error-msg\">
                <code>$message</code>
            </div>
        </div>
    ";
}
