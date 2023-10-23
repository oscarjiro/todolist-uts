import { getTasks, deleteTask, taskAction } from "./api.js";
import { taskItem, emptyTaskMessage, systemError } from "./components.js";
import { TASK_PROGRESS } from "./const.js";
import {
    capitalizeFirst,
    closeModal,
    fadeInMain,
    formatDate,
    isValidProgress,
    popUpModal,
} from "./utils.js";

$(document).ready(async () => {
    // Load all tasks
    await activatePage("All", true);

    // Add event listener to each section
    for (const section in sections) {
        sections[section].element.click(() => {
            const sameSection =
                section === "All"
                    ? !TASK_PROGRESS.includes(states.activePage)
                    : states.activePage === sections;
            !sameSection && activatePage(section);
        });
    }

    // Fade in main
    fadeInMain();
});

// Elements
const tasksContainer = $("#tasksContainer");
const completedTasksPercentage = $("#completedTasksPercentage");

// States
const states = {
    activePage: "All",
    tasksCount: {
        All: 0,
        "Not started": 0,
        "Waiting on": 0,
        "In progress": 0,
        Completed: 0,
    },
    tasks: [],
};

// Sections
const sections = {
    All: {
        element: $("#allSection"),
        count: $("#allSectionCount"),
    },
    "Not started": {
        element: $("#notStartedSection"),
        count: $("#notStartedSectionCount"),
    },
    "Waiting on": {
        element: $("#waitingOnSection"),
        count: $("#waitingOnSectionCount"),
    },
    "In progress": {
        element: $("#inProgressSection"),
        count: $("#inProgressSectionCount"),
    },
    Completed: {
        element: $("#completedSection"),
        count: $("#completedSectionCount"),
    },
};

// Reset task count
const resetTasksCount = () => {
    for (const progress in states.tasksCount) {
        states.tasksCount[progress] = 0;
    }
};

// Update task count
const updateTasksCount = () => {
    // Reset tasks count
    resetTasksCount();

    // Update tasks count
    states.tasks.forEach(({ progress }) => {
        states.tasksCount[progress]++;
        states.tasksCount.All++;
    });

    // Update each task count
    for (const progress in sections) {
        // Update UI count
        sections[progress].count.html(states.tasksCount[progress]);

        // Update container to empty message if 0 tasks
        if (
            states.activePage === progress &&
            states.tasksCount[progress] === 0
        ) {
            tasksContainer.html(emptyTaskMessage);
        }
    }

    // Update container indefinitely if all tasks are empty
    if (states.tasksCount.All === 0) {
        tasksContainer.html(emptyTaskMessage);
    }

    // Update task completion percentage
    completedTasksPercentage.html(
        `${
            states.tasksCount.All > 0
                ? (
                      (states.tasksCount.Completed / states.tasksCount.All) *
                      100
                  ).toFixed(0)
                : 0
        }% Done`
    );
};

// Load all tasks
const loadTasks = async () => {
    // Get all tasks
    const result = await getTasks();

    // If error in response, show error
    if (!result.ok) {
        console.error(result.error);
    }

    // Otherwise, set tasks state as result
    states.tasks = result.result;

    // Return result
    return result;
};

// Confirm execution action
const confirmTaskAction = async (action, taskId, taskName) => {
    // Do nothing on invalid action
    if (action !== "complete" && action !== "delete") {
        console.error(`Unidentified action "${action}."`);
        return;
    }

    // Pop up modal
    popUpModal(
        `Are you sure you want to ${action} <strong class="font-bold">"${taskName}"</strong>?`,
        capitalizeFirst(action),
        action === "delete" ? "button-red" : "button-green"
    );

    // Execute task on confirmation event listener
    const acceptExecuteAction = async () => {
        // Delete task
        const response =
            action === "delete"
                ? await deleteTask(taskId)
                : await taskAction(taskId, action);

        // If error in response, close modal and return
        if (!response.ok) {
            console.error(response.error);
            $("#confirmAction").off("click", acceptExecuteAction);
            closeModal();
            return;
        }

        // If successful response, refresh tasks
        await activatePage(states.activePage, true);

        // Remove event listener and close modal
        $("#confirmAction").off("click", acceptExecuteAction);
        closeModal();
    };

    // Add event listener to confirm button
    $("#confirmAction").click(acceptExecuteAction);
};

// Toggle start or stop task
const toggleStartTask = async (taskId) => {
    // Toggle task
    const response = await taskAction(taskId, "toggle");

    // If error in response, return
    if (!response.ok) {
        console.error(response.error);
        return;
    }

    // If successful response, refresh tasks
    await activatePage(states.activePage, true);
};

// Activate page
const activatePage = async (section = null, reload = false) => {
    // Set active page state
    states.activePage = isValidProgress(section) ? section : "All";

    // Change section header style
    for (const section in sections) {
        const classSuffix = section === states.activePage ? "-active" : "";
        sections[section].element.attr(
            "class",
            `section-title-item${classSuffix} group`
        );
        sections[section].count.attr(
            "class",
            `section-title-count${classSuffix}`
        );
    }

    // If reload is set to true, reload tasks
    if (reload) {
        const response = await loadTasks();

        // If unsuccessful, show error and return
        if (!response.ok) {
            tasksContainer.html(
                systemError(response.error.message, response.error?.scope)
            );
            return;
        }
    }

    // Append every task
    tasksContainer.html("");
    states.tasks.forEach(
        ({ id, name, progress, todo_date, description, dependent_name }) => {
            if (
                !TASK_PROGRESS.includes(states.activePage) ||
                states.activePage === progress
            ) {
                tasksContainer.append(
                    taskItem(
                        id,
                        name,
                        progress,
                        formatDate(todo_date),
                        description,
                        dependent_name
                    )
                );

                // Delete task event listener
                $(`#deleteTask${id}`).click(
                    async () => await confirmTaskAction("delete", id, name)
                );

                // Complete task event listener
                if (progress !== "Completed") {
                    $(`#completeTask${id}`).click(
                        async () =>
                            await confirmTaskAction("complete", id, name)
                    );
                }

                // Toggle task event listener
                if (progress === "Not started" || progress === "In progress") {
                    $(`#toggleTask${id}`).click(
                        async () => await toggleStartTask(id)
                    );
                }
            }
        }
    );

    // Add intersection observer to each task
    const showOnScroll = (task) => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    task.classList.add("slide-right-smooth");
                    observer.disconnect();
                }
            });
        });

        io.observe(task);
    };
    document.querySelectorAll(".task").forEach(showOnScroll);

    // Update tasks count if reload is true
    updateTasksCount();
};
