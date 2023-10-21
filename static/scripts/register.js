import { ERROR } from "./const.js";
import {
    getValue,
    checkUsername,
    checkPassword,
    toggleViewPassword,
    errorMessageId,
    onInputHandler,
    showError,
    fadeInMain,
    checkEmail,
} from "./utils.js";
import { errorMessage, emptyError } from "./components.js";

$(document).ready(() => {
    // Username on input check
    username.element.on("input", () => {
        onInputHandler(
            username.element,
            username.element,
            checkUsername,
            username.error,
            ERROR.username,
            username.errorId
        );
    });

    // Email on input check
    email.element.on("input", () =>
        onInputHandler(
            email.element,
            email.element,
            checkEmail,
            email.error,
            ERROR.email,
            email.errorId
        )
    );

    // Password on input check
    password.element.on("input", () => {
        onInputHandler(
            password.element,
            $("#passwordInput"),
            checkPassword,
            password.error,
            ERROR.password,
            password.errorId
        );

        // Check confirm password
        handleConfirmPassword(
            getValue(password.element),
            getValue(confirmPassword.element)
        );
    });

    // Confirm password on input check
    confirmPassword.element.on("input", () =>
        handleConfirmPassword(
            getValue(password.element),
            getValue(confirmPassword.element)
        )
    );

    // Password visibility toggle
    password.toggle.click(() =>
        toggleViewPassword(password.toggle, password.element)
    );
    confirmPassword.toggle.click(() =>
        toggleViewPassword(confirmPassword.toggle, confirmPassword.element)
    );

    // Form submission handler
    $("#registerForm").submit((event) => formHandler(event));

    // Fade in main
    fadeInMain();
});

// Elements
const inputs = {
    username: {
        element: $("#username"),
        error: errorMessage(ERROR.username, "username"),
        emptyError: errorMessage(emptyError("username"), "username"),
        errorId: errorMessageId("username"),
    },
    email: {
        element: $("#email"),
        error: errorMessage(ERROR.email, "email"),
        emptyError: errorMessage(emptyError("email"), "email"),
        errorId: errorMessageId("email"),
    },
    password: {
        element: $("#password"),
        error: errorMessage(ERROR.password, "password"),
        emptyError: errorMessage(emptyError("password"), "password"),
        errorId: errorMessageId("password"),
        toggle: $("#toggleViewPassword"),
    },
    confirmPassword: {
        element: $("#confirmPassword"),
        error: errorMessage(ERROR.confirmPassword, "confirmPassword"),
        errorId: errorMessageId("confirmPassword"),
        toggle: $("#toggleViewConfirmPassword"),
    },
};

// Destructure
const { username, email, password, confirmPassword } = inputs;

// Ensure password confirmation matches
const handleConfirmPassword = (passwordValue, confirmPasswordValue) => {
    const validConfirmPassword = confirmPasswordValue === passwordValue;
    if (!validConfirmPassword && $(confirmPassword.errorId).length === 0) {
        $("#confirmPasswordInput").after(confirmPassword.error);
    } else if (validConfirmPassword && $(confirmPassword.errorId).length > 0) {
        $(confirmPassword.errorId).remove();
    }
};

// Form handler
const formHandler = (event) => {
    // Check for form validity
    const emailValue = getValue(email.element);
    const usernameValue = getValue(username.element);
    const passwordValue = getValue(password.element);
    const validUsername = checkUsername(usernameValue);
    const validEmail = checkEmail(emailValue);
    const validPassword = checkPassword(passwordValue);
    const validConfirmPassword =
        getValue(confirmPassword.element) === passwordValue;
    const validForm =
        validEmail && validUsername && validPassword && validConfirmPassword;

    // If invalid, prevent submission
    if (!validForm) {
        event.preventDefault();

        // Add errors to invalid fields
        showError(
            usernameValue,
            username.element,
            validUsername,
            "username",
            username.error,
            username.emptyError,
            ERROR.username,
            username.errorId
        );

        showError(
            emailValue,
            email.element,
            validEmail,
            "email",
            email.error,
            email.emptyError,
            ERROR.email,
            email.errorId
        );

        showError(
            passwordValue,
            $("#passwordInput"),
            validPassword,
            "password",
            password.error,
            password.emptyError,
            ERROR.password,
            password.errorId
        );

        if (!validConfirmPassword && $(confirmPassword.errorId).length === 0) {
            $("#confirmPasswordInput").after(confirmPassword.error);
        }
    }
};
