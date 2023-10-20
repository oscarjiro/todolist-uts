import {
    USERNAME_REGEXP,
    PASSWORD_REGEXP,
    NAME_MAX_LENGTH,
    TASK_PROGRESS,
    TASKNAME_MAX_LENGTH,
    TASKDESC_MAX_LENGTH,
    TASK_TODODATE_REGEXP,
} from "./const.js";
import {
    emptyError,
    passwordToggleHide,
    passwordToggleVisible,
} from "./components.js";

// Uppercase every first letter of a word
export const uppercaseWords = (string) => {
    let words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return words.join(" ");
};

// Capitalize first letter
export const capitalizeFirst = (string) =>
    !string ? string : string.charAt(0).toUpperCase() + string.slice(1);

// Check if empty string
export const isEmpty = (string) => string.length === 0;

// Convert to camel case
export const toCamelCase = (string) =>
    string.replace(/(\s|-|_)(.)/g, (_, separator, char) => char.toUpperCase());

// Clean text input
export const cleanInput = (input) => input.trim();

// Get input value
export const getValue = (input) => cleanInput(input?.val());

// Toggle view password
export const toggleViewPassword = (toggle, input) => {
    const isHidden = input.attr("type") === "password";
    toggle.html(isHidden ? passwordToggleHide : passwordToggleVisible);
    input.attr("type", isHidden ? "text" : "password");
};

// Get error message ID
export const errorMessageId = (name) => `#${name}ErrorMessage`;

// Check username
export const checkName = (name) =>
    name.length > 0 && name.length <= NAME_MAX_LENGTH;

// Check username
export const checkUsername = (username) => USERNAME_REGEXP.test(username);

// Check password
export const checkPassword = (password) => PASSWORD_REGEXP.test(password);

// Check if valid progress
export const isValidProgress = (progress) => TASK_PROGRESS.includes(progress);

// Check task name
export const checkTaskName = (name) =>
    name.length > 0 && name.length <= TASKNAME_MAX_LENGTH;

// Check task description
export const checkTaskDescription = (description) =>
    description.length <= TASKDESC_MAX_LENGTH || !description;

// Check date in ISO 8601 format
export const checkDate = (date) => {
    // Ensure in YYYY-MM-DD format
    if (!TASK_TODODATE_REGEXP.test(date)) return false;

    // Get input and today's date as date objects
    const inputDate = new Date(date);
    const today = new Date();

    // Set both dates to midnight to strictly compare dates
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare if date is at least today
    return inputDate >= today;
};

// Convert ISO 8601 to formatted date
export const formatDate = (inputDate) => {
    // Create a Date object from the input date string
    const dateParts = inputDate.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month - 1, day);

    // Define arrays for month names and day names
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    // Get the formatted date
    const formattedDate =
        day + " " + months[month - 1].substr(0, 3) + " " + year;

    // Get the day of the week
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek.substr(0, 3)}, ${formattedDate}`;
};

// Fade in main
export const fadeInMain = () =>
    setTimeout(() => $("main").removeClass("opacity-0"), 100);

// Close modal
export const closeModal = () => {
    $("#cancelAction").off("click", closeModal);
    $("#blackout").addClass("opacity-0");
    setTimeout(() => $("#blackout").remove(), 300);
};

// Pop up modal
export const popUpModal = (message, action, buttonClass) => {
    $("body").append(`
        <section id="blackout" class="hidden opacity-0">
            <div id="modal">
                <div id="modalTitle">${message}</div>
                <div class="modal-buttons-ctr">
                    <button id="cancelAction" class="button-gray">Cancel</button>
                    <button id="confirmAction" class="${buttonClass}">${action}</button>
                </div>
            </div>
        </section>
    `);
    $("#blackout").removeClass("hidden");
    setTimeout(() => $("#blackout").removeClass("opacity-0"), 100);

    // Event listeners to close modal
    $("#cancelAction").click(closeModal);
};

// General input handler
export const onInputHandler = (
    input,
    errorPlacement,
    validator,
    errorElement,
    errorMessage,
    errorId
) => {
    // Check if valid
    const value = getValue(input);
    const isValid = !value || validator(value);

    // If invalid and no error yet, show error
    if (!isValid && $(errorId).length === 0) {
        errorPlacement.after(errorElement);
    }

    // If invalid but different error is shown, update error
    else if (
        !isValid &&
        $(errorId).length > 0 &&
        $(errorId).text() !== errorMessage
    ) {
        $(errorId).text(errorMessage);
    }

    // If valid but error was shown, remove error
    else if (isValid && $(errorId).length > 0) {
        $(errorId).remove();
    }
};

// Simple non-empty on input handler
export const onlyFillInputHandler = (errorId) => {
    $(errorId).remove();
};

// General error shower
export const showError = (
    value,
    errorPlacement,
    isValid,
    name,
    errorElement,
    emptyErrorElement,
    errorMessage,
    errorId
) => {
    // Check if value is empty
    const emptyValue = isEmpty(value);

    // Determine appropriate element and message
    const appropriateErrorElement = emptyValue
        ? emptyErrorElement
        : errorElement;
    const appropriateErrorMessage = emptyValue
        ? emptyError(name)
        : errorMessage;

    // If invalid and no error shown, show error element
    if (!isValid && $(errorId).length === 0) {
        errorPlacement.after(appropriateErrorElement);
    }

    // If invalid but inappropriate error shown, update error
    else if (
        !isValid &&
        $(errorId).length > 0 &&
        $(errorId).text() !== appropriateErrorMessage
    ) {
        $(errorId).text(appropriateErrorMessage);
    }

    // If valid, remove error element
    else if (isValid) {
        $(errorId).remove();
    }
};

// Simple non-empty error shower
export const onlyFillShowError = (
    valid,
    errorElement,
    errorPlacement,
    errorId
) => {
    if (!valid && $(errorId).length === 0) {
        errorPlacement.after(errorElement);
    } else if (valid) {
        $(errorId).remove();
    }
};
