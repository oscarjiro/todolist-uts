import { emptyError, errorMessage } from "./components.js";
import {
    checkDate,
    checkTaskDescription,
    checkTaskName,
    errorMessageId,
    fadeInMain,
    getValue,
    onInputHandler,
    showError,
} from "./utils.js";
import { ERROR, TASKDESC_MAX_LENGTH } from "./const.js";

$(document).ready(() => {
    // Name on input check
    name.element.on("input", () =>
        onInputHandler(
            name.element,
            name.errorPlacement,
            checkTaskName,
            name.error,
            ERROR.taskName,
            name.errorId
        )
    );

    // Date on change check
    date.element.change(() => {
        onInputHandler(
            date.element,
            date.errorPlacement,
            checkDate,
            date.error,
            ERROR.taskDate,
            date.errorId
        );
    });

    // Description on input check
    description.element.on("input", () => {
        // Get value and update count
        let value = description.element.val();

        // Truncate values
        const truncatedValue = value.substring(0, TASKDESC_MAX_LENGTH);
        description.element.val(truncatedValue);

        // Update element
        value = description.element.val();
        $("#textareaCount").text(value.length);

        // Input handler
        onInputHandler(
            description.element,
            description.errorPlacement,
            checkTaskDescription,
            description.error,
            ERROR.taskDescription,
            description.errorId
        );
    });

    // Form submission
    $("#editForm").submit((event) => {
        // Get all values
        const nameValue = getValue(name.element);
        const dateValue = getValue(date.element);
        const descriptionValue = getValue(description.element);

        // Check form validity
        const validName = checkTaskName(nameValue);
        const validDate = checkDate(dateValue);
        const validDescription = checkTaskDescription(descriptionValue);
        const validForm = validName && validDate && validDescription;

        // If invalid, prevent submission
        if (!validForm) {
            event.preventDefault();

            // Add errors to invalid fields
            showError(
                nameValue,
                name.element,
                validName,
                "task name",
                name.error,
                name.emptyError,
                ERROR.taskName,
                name.errorId
            );

            showError(
                descriptionValue,
                description.element,
                validDescription,
                "task description",
                description.error,
                "",
                ERROR.taskDescription,
                description.errorId
            );

            showError(
                dateValue,
                date.element,
                validDate,
                "to-do date",
                date.error,
                date.emptyError,
                ERROR.taskDate,
                date.errorId
            );
        }
    });

    // Fade in main
    fadeInMain();
});

// Elements
const inputs = {
    name: {
        element: $("#name"),
        error: errorMessage(ERROR.taskName, "name"),
        emptyError: errorMessage(emptyError("task name"), "name"),
        errorId: errorMessageId("name"),
        errorPlacement: $("#name"),
    },
    description: {
        element: $("#description"),
        error: errorMessage(ERROR.taskDescription, "description"),
        errorId: errorMessageId("description"),
        errorPlacement: $("#descriptionContainer"),
    },
    date: {
        element: $("#date"),
        error: errorMessage(ERROR.taskDate, "date"),
        emptyError: errorMessage(emptyError("to-do date"), "date"),
        errorId: errorMessageId("date"),
        errorPlacement: $("#date"),
    },
};

// Destructure inputs
const { name, description, date } = inputs;
