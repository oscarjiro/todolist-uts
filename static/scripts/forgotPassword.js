import { emptyError, errorMessage } from "./components.js";
import {
    checkEmail,
    errorMessageId,
    fadeInMain,
    getValue,
    onInputHandler,
    showError,
} from "./utils.js";
import { ERROR } from "./const.js";

$(document).ready(() => {
    // Email event listener
    email.element.on("input", () =>
        onInputHandler(
            email.element,
            email.errorPlacement,
            checkEmail,
            email.error,
            ERROR.email,
            email.errorId
        )
    );

    // Form handler
    $("#forgotPasswordForm").submit((event) => {
        // Get all values
        const emailValue = getValue(email.element);

        // Check form validity
        const validForm = checkEmail(emailValue);

        // If invalid, prevent submission
        if (!validForm) {
            event.preventDefault();

            // Add errors to invalid fields
            showError(
                emailValue,
                email.element,
                validForm,
                "email",
                email.errorPlacement,
                email.emptyError,
                ERROR.email,
                email.errorId
            );
        }
    });

    // Fade in main
    fadeInMain();
});

// Elements
const email = {
    element: $("#email"),
    errorPlacement: $("#email"),
    error: errorMessage(ERROR.email, "email"),
    emptyError: errorMessage(emptyError("email"), "email"),
    errorId: errorMessageId("email"),
};
