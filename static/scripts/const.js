// User constraints
export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 25;
export const USERNAME_REGEXP = new RegExp(
    `^(?!.*[.]{2,})[a-z\\d_\.]{${USERNAME_MIN_LENGTH - 1},${
        USERNAME_MAX_LENGTH - 1
    }}[a-z\\d_]$`
);
export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEXP = new RegExp(
    `^(?=.*[A-Z])(?=.*\\d)(?=.*[~\`!@#\\$%^&*()_\\-+={[}]|:;"'<,>.?\\/]).{${PASSWORD_MIN_LENGTH},}$`
);

// Task constraints
export const TASKNAME_MAX_LENGTH = 50;
export const TASKDESC_MAX_LENGTH = 150;
export const TASK_PROGRESS = [
    "Not started",
    "Waiting on",
    "In progress",
    "Completed",
];
export const TASK_TODODATE_REGEXP = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");

// Error object
export const ERROR = {
    name: `Name must be at most ${NAME_MAX_LENGTH} characters long.`,
    username: `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters inclusive and can only contain alphabets, numbers, underscores, and periods.`,
    password: `Password must be at least ${PASSWORD_MIN_LENGTH} characters and must contain at least one uppercase letter, number, and special character.`,
    confirmPassword: "Password does not match.",
    taskName: `Task name must be at most ${TASKNAME_MAX_LENGTH} characters long.`,
    taskDescription: `Task description must be at most ${TASKDESC_MAX_LENGTH} characters long.`,
    taskProgress: "Invalid task progress.",
    taskDate: "To-do date cannot be in the past.",
    taskDependent: "Selected task is invalid or does not exist.",
    general: "An error occured. Please try again.",
};
