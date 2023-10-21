<?php

// Set default timezone
date_default_timezone_set("Asia/Jakarta");

// Get route
function get_route()
{
    return basename($_SERVER["PHP_SELF"]);
}

// Redirect to error page
function redirect_error()
{
    if (get_route() !== "error.php") header("Location: error.php");
}

// Check if authenticated
function is_authenticated()
{
    return isset($_SESSION["is_authenticated"]) && $_SESSION["is_authenticated"] && isset($_SESSION["username"]) && $_SESSION["username"];
}

// Logout
function logout()
{
    $route = get_route();
    session_destroy();
    if ($route !== "login.php" && $route !== "register.php" && $route !== "forgot-password.php") {
        header("Location: login.php");
        exit;
    } else {
        session_start();
    }
}

// Clean data
function clean_data($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    return htmlspecialchars($data);
}

// Check if empty string
function is_empty($string)
{
    return strlen($string) === 0;
}

// Empty error message
function empty_error($name)
{
    $name = ucfirst($name);
    return "$name must be filled.";
}

// Convert to camel case
function to_camel_case($input)
{
    $words = preg_split("/\s+/", $input);
    $result = lcfirst(array_shift($words));
    foreach ($words as $word) {
        $result .= ucfirst($word);
    }
    return $result;
}

// Greet according to time of day
function greet()
{
    $current_hour = date("H");
    if ($current_hour >= 5 && $current_hour < 12) {
        $greeting = "Good morning";
    } elseif ($current_hour >= 12 && $current_hour < 18) {
        $greeting = "Good afternoon";
    } elseif ($current_hour >= 18 && $current_hour < 24) {
        $greeting = "Good evening";
    } else {
        $greeting = "Good night";
    }
    return $greeting;
}

// Get current date
function get_curdate()
{
    return date("Y-m-d");
}

// Get current day
function get_curday()
{
    return date("l");
}

// Convert ISO 8601 to formatted date
function convert_date($date)
{
    $date = strtotime($date);
    return date("j F Y", $date);
}

// Check if todo date is valid
function check_date($date)
{
    // Ensure in YYYY-MM-DD format
    if (!preg_match(TASK_TODODATE_REGEXP, $date)) return false;

    // Create DateTime objects for the input date and today's date
    $inputDate = new DateTime($date);
    $today = new DateTime();

    // Set both dates to midnight (00:00:00) to compare only the dates
    $inputDate->setTime(0, 0, 0);
    $today->setTime(0, 0, 0);

    // Compare the two dates
    return $inputDate >= $today;
}
