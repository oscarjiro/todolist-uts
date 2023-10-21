// Get all tasks
export const getTasks = async () => {
    try {
        const response = await fetch("api/get_tasks.php");
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            ok: false,
            result: [],
            error: { message: error },
        };
    }
};

// Delete task
export const deleteTask = async (taskId) => {
    try {
        const response = await fetch("api/delete_task.php", {
            method: "DELETE",
            body: JSON.stringify({
                taskId: taskId,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            ok: false,
            error: { message: error },
        };
    }
};

// Modify task
export const taskAction = async (taskId, action) => {
    try {
        const response = await fetch("api/task_action.php", {
            method: "PUT",
            body: JSON.stringify({
                taskId: taskId,
                action: action,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            ok: false,
            error: { message: error },
        };
    }
};

// Send password reset request
export const sendPasswordResetLink = async (email) => {
    try {
        const response = await fetch("api/request_password_reset.php", {
            method: "POST",
            body: JSON.stringify({
                email: email,
            }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            ok: false,
            error: { message: "An error occured. Please try again." },
        };
    }
};
