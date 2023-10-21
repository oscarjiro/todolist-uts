// User constraints
export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 25;
export const USERNAME_REGEXP = new RegExp(
    `^(?!.*[.]{2,})[a-z\\d_\.]{${USERNAME_MIN_LENGTH - 1},${
        USERNAME_MAX_LENGTH - 1
    }}[a-z\\d_]$`
);
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEXP = new RegExp(
    `^(?=.*[A-Z])(?=.*\\d)(?=.*[~\`!@#\\$%^&*()_\\-+={[}]|:;"'<,>.?\\/]).{${PASSWORD_MIN_LENGTH},}$`
);
export const EMAIL_MAX_LENGTH = 255;
export const EMAIL_REGEXP = new RegExp(
    "(?:[a-z0-9!#$%&'*+\\/?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)])"
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
    username: `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters inclusive and can only contain alphabets, numbers, underscores, and periods.`,
    email: "Please provide a valid email address.",
    password: `Password must be at least ${PASSWORD_MIN_LENGTH} characters and must contain at least one uppercase letter, number, and special character.`,
    confirmPassword: "Password does not match.",
    taskName: `Task name must be at most ${TASKNAME_MAX_LENGTH} characters long.`,
    taskDescription: `Task description must be at most ${TASKDESC_MAX_LENGTH} characters long.`,
    taskProgress: "Invalid task progress.",
    taskDate: "To-do date cannot be in the past.",
    taskDependent: "Selected task is invalid or does not exist.",
    general: "An error occured. Please try again.",
};
