import { getTasks, deleteTask } from "./api.js";
import { taskItem, emptyTaskMessage, systemError } from "./components.js";
import { TASK_PROGRESS } from "./const.js";
import {
    closeModal,
    fadeInMain,
    formatDate,
    isValidProgress,
    popUpModal,
} from "./utils.js";

$(document).ready(() => {
    async function f() {
        // Load all tasks
        loadTasks();

        // Add event listener to each section
        for (const section in sections) {
            sections[section].element.click(async () => {
                const sameSection =
                    section === "All"
                        ? !TASK_PROGRESS.includes(states.activePage)
                        : states.activePage === sections;
                !sameSection && (await loadTasks(section));
            });
        }

        // Fade in main
        fadeInMain();
    }

    f();
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
    // Ensure all counts add up
    states.tasksCount.All = 0;
    for (let i = 0; i < TASK_PROGRESS.length; i++) {
        states.tasksCount.All += states.tasksCount[TASK_PROGRESS[i]];
    }

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

// Activate page
const activatePage = (progress) => {
    states.activePage = isValidProgress(progress) ? progress : "All";
    for (const progress in sections) {
        const classSuffix = progress === states.activePage ? "-active" : "";
        sections[progress].element.attr(
            "class",
            `section-title-item${classSuffix} group`
        );
        sections[progress].count.attr(
            "class",
            `section-title-count${classSuffix}`
        );
    }
};

// Confirm delete task
const confirmDeleteTask = async (taskId, taskName) => {
    // Pop up modal
    popUpModal(
        `Are you sure you want to delete <strong class="font-bold">"${taskName}"</strong>?`,
        "Delete"
    );

    // Delete task event listener on confirmation
    const acceptDeleteTask = async () => {
        // Delete task
        const result = await deleteTask(taskId);

        // If error in response, show error
        if (!result.ok) {
            console.error(result.error);
            $("#confirmAction").off("click", acceptDeleteTask);
            closeModal();
            return;
        }

        // If successful response, refresh tasks
        await loadTasks(states.activePage);

        // Remove event listener and close modal
        $("#confirmAction").off("click", acceptDeleteTask);
        closeModal();
    };

    $("#confirmAction").click(acceptDeleteTask);
};

// Load all tasks
const loadTasks = async (taskProgress = null) => {
    // Check task
    taskProgress = isValidProgress(taskProgress) ? taskProgress : "All";

    // Get all tasks
    const result = await getTasks();

    // If error in response, show error
    if (!result.ok) {
        console.error(result.error);
        tasksContainer.html(
            systemError(result.error.message, result.error?.scope)
        );
        return;
    }

    // Retrive tasks result
    const tasks = result.result;

    // Set active page and reset count
    activatePage(taskProgress);
    resetTasksCount();

    // If there is tasks, append every task
    tasksContainer.html("");
    tasks.forEach(
        ({ id, name, progress, todo_date, description, dependent_name }) => {
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
                async () => await confirmDeleteTask(id, name)
            );

            // Simulatenously update the task count object
            states.tasksCount[progress]++;
        }
    );

    // Update tasks count in the page
    updateTasksCount();
};
