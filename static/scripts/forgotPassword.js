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
import { sendPasswordResetLink } from "./api.js";

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
    $("#sendReset").click(async () => {
        // Get all values
        const emailValue = getValue(email.element);

        // Check form validity
        const validForm = checkEmail(emailValue);

        // If invalid, prevent request
        if (!validForm) {
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

            return;
        }

        // Send password reset link
        const response = await sendPasswordResetLink(emailValue);
        const message = response.ok
            ? "Password reset link has been sent to your email."
            : response.error.message;
        const messageColor = response.ok
            ? "text-[rgb(var(--green-rgb))]"
            : "text-invalid";
        const messageId = "requestResponseMessage";
        if (!response.ok) console.error(response.error);

        if ($(`#${messageId}`).length === 0) {
            $("#sendReset").after(`
                <div id="${messageId}" class="text-center ${messageColor}">${message}</div>
            `);
        } else {
            $(`#${messageId}`)
                .attr("class", `text-center ${messageColor}`)
                .text(message);
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
