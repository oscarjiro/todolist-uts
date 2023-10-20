import { ERROR, TASKDESC_MAX_LENGTH } from "./const.js";
import {
    checkTaskDescription,
    getValue,
    errorMessageId,
    onInputHandler,
    checkTaskName,
    isValidProgress,
    fadeInMain,
    checkDate,
    showError,
} from "./utils.js";
import { emptyError, errorMessage } from "./components.js";
import { getTasks } from "./api.js";

$(document).ready(() => {
    async function f() {
        // Get all tasks
        const allTasks = await loadAllTasks();
        const tasks = allTasks.filter((task) => task.progress !== "Completed");
        if (tasks.length === 0) {
            $("#waitingOnProgress").remove();
        } else {
            tasks.forEach(({ id, name }) => {
                dependentTask.element.append(`
                    <option value="${id}"><strong class="font-bold">${name}</strong></option>
                `);
            });
        }

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

        // Progress buttons
        $("#progressChoices").on("click", "[data-progress]", function () {
            const progressValue = $(this).data("progress");

            // Update hidden progress input
            progress.element.val(progressValue).trigger("change");

            // Change button class for all children
            $("#progressChoices [data-progress]").each(function () {
                $(this).toggleClass(
                    "button-gray",
                    $(this).data("progress") !== progressValue
                );
                $(this).toggleClass(
                    "button-gray-active",
                    $(this).data("progress") === progressValue
                );
            });
        });

        // Progress element when changed
        progress.element.change(() => {
            // Basic input handler
            onInputHandler(
                progress.element,
                progress.errorPlacement,
                isValidProgress,
                progress.error,
                ERROR.taskProgress,
                progress.errorId
            );

            // If progress is waiting on, show dependent input
            const progressValue = getValue(progress.element);
            if (tasks.length > 0 && progressValue === "Waiting on") {
                // Unhide input container
                dependentTask.parent.removeClass("hidden");
                setTimeout(
                    () => dependentTask.parent.removeClass("opacity-0"),
                    100
                );
            } else {
                // Hide input container
                if (!dependentTask.parent.hasClass("opacity-0")) {
                    dependentTask.parent.addClass("opacity-0");
                    if (!dependentTask.parent.hasClass("hidden")) {
                        setTimeout(
                            () => dependentTask.parent.addClass("hidden"),
                            100
                        );
                    }
                } else if (!dependentTask.parent.hasClass("hidden")) {
                    dependentTask.parent.addClass("hidden");
                }
                $(dependentTask.errorId).remove();
            }
        });

        // Form submission
        $("#addForm").submit((event) => {
            // Get all values
            const nameValue = getValue(name.element);
            const descriptionValue = getValue(description.element);
            const progressValue = getValue(progress.element);
            const dateValue = getValue(date.element);
            const dependentTaskValue = parseInt(dependentTask.element.val());

            // Check form validity
            const validName = checkTaskName(nameValue);
            const validDescription = checkTaskDescription(descriptionValue);
            const validProgress = isValidProgress(progressValue);
            const validDate = checkDate(dateValue);
            const validDependentTask =
                (progressValue !== "Waiting on" && !dependentTaskValue) ||
                Number.isInteger(dependentTaskValue);
            const validForm =
                validName &&
                validDescription &&
                validProgress &&
                validDate &&
                validDependentTask;

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
                    progressValue,
                    progress.element,
                    validProgress,
                    "task progress",
                    progress.error,
                    progress.emptyError,
                    ERROR.taskProgress,
                    progress.errorId
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

                const emptyDependentTask =
                    !dependentTaskValue && !validDependentTask;
                const dependentTaskError = emptyDependentTask
                    ? dependentTask.emptyError
                    : dependentTask.error;
                const dependentTaskErrorMessage = emptyDependentTask
                    ? emptyError("task dependent")
                    : ERROR.taskDependent;
                if (
                    !validDependentTask &&
                    $(dependentTask.errorId).length === 0
                ) {
                    dependentTask.errorPlacement.after(dependentTaskError);
                } else if (
                    !validDependentTask &&
                    $(dependentTask.errorId).length > 0 &&
                    $(dependentTask.errorId).text() !==
                        dependentTaskErrorMessage
                ) {
                    $(dependentTask.errorId).text(dependentTaskErrorMessage);
                } else if (validDependentTask) {
                    $(dependentTask.errorId).remove();
                }
            }
        });

        // Show main
        fadeInMain();
    }

    f();
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
    progress: {
        element: $("#progress"),
        error: errorMessage(ERROR.taskProgress, "progress"),
        emptyError: errorMessage(emptyError("task progress"), "progress"),
        errorId: errorMessageId("progress"),
        errorPlacement: $("#progressChoices"),
    },
    date: {
        element: $("#date"),
        error: errorMessage(ERROR.taskDate, "date"),
        emptyError: errorMessage(emptyError("to-do date"), "date"),
        errorId: errorMessageId("date"),
        errorPlacement: $("#date"),
    },
    dependentTask: {
        element: $("#dependentTask"),
        error: errorMessage(ERROR.taskDependent, "dependentTask"),
        emptyError: errorMessage(emptyError("task dependent"), "dependentTask"),
        errorId: errorMessageId("dependentTask"),
        parent: $("#dependentTaskInputContainer"),
        errorPlacement: $("#dependentTask"),
    },
};

// Destructure inputs
const { name, description, progress, date, dependentTask } = inputs;

// Load all tasks
const loadAllTasks = async () => {
    const result = await getTasks();
    return result.result;
};
