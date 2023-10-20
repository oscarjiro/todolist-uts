import { ERROR } from "./const.js";
import {
    getValue,
    checkName,
    checkUsername,
    checkPassword,
    toggleViewPassword,
    errorMessageId,
    onInputHandler,
    showError,
} from "./utils.js";
import { errorMessage, emptyError } from "./components.js";

$(document).ready(() => {
    // Name on input check
    name.element.on("input", () =>
        onInputHandler(
            name.element,
            name.element,
            checkName,
            name.error,
            ERROR.name,
            name.errorId
        )
    );

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
});

// Elements
const inputs = {
    name: {
        element: $("#name"),
        error: errorMessage(ERROR.name, "name"),
        emptyError: errorMessage(emptyError("name"), "name"),
        errorId: errorMessageId("name"),
    },
    username: {
        element: $("#username"),
        error: errorMessage(ERROR.username, "username"),
        emptyError: errorMessage(emptyError("username"), "username"),
        errorId: errorMessageId("username"),
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
const { name, username, password, confirmPassword } = inputs;

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
    const nameValue = getValue(name.element);
    const usernameValue = getValue(username.element);
    const passwordValue = getValue(password.element);
    const validName = checkName(nameValue);
    const validUsername = checkUsername(usernameValue);
    const validPassword = checkPassword(passwordValue);
    const validConfirmPassword =
        getValue(confirmPassword.element) === passwordValue;
    const validForm =
        validName && validUsername && validPassword && validConfirmPassword;

    // If invalid, prevent submission
    if (!validForm) {
        event.preventDefault();

        // Add errors to invalid fields
        showError(
            nameValue,
            name.element,
            validName,
            "name",
            name.error,
            name.emptyError,
            ERROR.name,
            name.errorId
        );

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
