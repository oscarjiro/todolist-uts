import {
    getValue,
    toggleViewPassword,
    isEmpty,
    errorMessageId,
    onlyFillInputHandler,
    onlyFillShowError,
    fadeInMain,
} from "./utils.js";
import { errorMessage, emptyError } from "./components.js";

$(document).ready(() => {
    // Username on input check
    username.element.on("input", () => onlyFillInputHandler(username.errorId));

    // Password on input check
    password.element.on("input", () => onlyFillInputHandler(password.errorId));

    // Password visibility toggle
    password.toggle.click(() =>
        toggleViewPassword(password.toggle, password.element)
    );

    // Form submission handler
    $("#loginForm").submit((event) => formHandler(event));

    // Fade in main
    fadeInMain();
});

// Elements
const names = {
    username: "username",
    password: "password",
};

const inputs = {
    username: {
        element: $(`#${names.username}`),
        error: errorMessage(emptyError(names.username), names.username),
        errorId: errorMessageId(names.username),
        errorPlacement: $(`#${names.username}`),
    },
    password: {
        element: $(`#${names.password}`),
        error: errorMessage(emptyError(names.password), names.password),
        errorId: errorMessageId(names.password),
        errorPlacement: $("#passwordInput"),
        toggle: $("#toggleViewPassword"),
    },
};

const { username, password } = inputs;

// Form handler
const formHandler = (event) => {
    // Check for form validity
    const validUsername = !isEmpty(getValue(username.element));
    const validPassword = !isEmpty(getValue(password.element));
    const validForm = validUsername && validPassword;

    // If invalid, prevent submission
    if (!validForm) {
        event.preventDefault();

        // Add errors to invalid fields
        onlyFillShowError(
            validUsername,
            username.error,
            username.errorPlacement,
            username.errorId
        );
        onlyFillShowError(
            validPassword,
            password.error,
            password.errorPlacement,
            password.errorId
        );
    }
};
