import { ERROR } from "./const.js";
import {
    getValue,
    checkPassword,
    toggleViewPassword,
    errorMessageId,
    onInputHandler,
    showError,
    fadeInMain,
} from "./utils.js";
import { errorMessage, emptyError } from "./components.js";

$(document).ready(() => {
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
    $("#resetPasswordForm").submit((event) => formHandler(event));

    // Fade in main
    fadeInMain();
});

// Elements
const inputs = {
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
const { password, confirmPassword } = inputs;

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
    const passwordValue = getValue(password.element);
    const validPassword = checkPassword(passwordValue);
    const validConfirmPassword =
        getValue(confirmPassword.element) === passwordValue;
    const validForm = validPassword && validConfirmPassword;

    // If invalid, prevent submission
    if (!validForm) {
        event.preventDefault();

        // Add errors to invalid fields
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
