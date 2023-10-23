import { ERROR } from "./const.js";
import { capitalizeFirst } from "./utils.js";

// Error message
export const errorMessage = (message, name) => `
    <div id="${name}ErrorMessage" class="error-msg">
        ${message}
    </div>
`;

// Open eye and hidden eye icon
export const passwordToggleHide = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
`;

export const passwordToggleVisible = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
`;

// Done icon
const doneIconOutline = (taskId) => `
    <svg id="completeTask${taskId}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="currentColor" class="task-done-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
`;
const doneIconSolid = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="task-done-icon hover:scale-100 cursor-default">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
    </svg>
`;

// Task action icons
const deleteIcon = (id) => `
    <svg id="deleteTask${id}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="task-action-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
`;
const editIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="task-action-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
`;
const startIcon = (id) => `
    <svg id="toggleTask${id}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="task-action-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
`;
const stopIcon = (id) => `
    <svg id="toggleTask${id}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="task-action-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
`;

// Task item
export const taskItem = (
    id,
    name,
    progress,
    todoDate,
    description = null,
    dependentName = null
) => {
// Animation
    $(document).ready(function() {
        // Dapatkan semua elemen task
        const taskElements = document.querySelectorAll('.task');
        const sectionIds = ["allSection", "notStartedSection", "waitingOnSection", "inProgressSection", "completedSection"];
    
        // Fungsi untuk mendeteksi apakah elemen dalam jendela tampilan
        function isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    
        // Fungsi untuk mengaktifkan elemen "slide-in" saat mereka masuk dalam tampilan
        function activateSlideInOnScroll() {
            const slideInElements = document.querySelectorAll('.slide-in');
    
            taskElements.forEach((taskElement, index) => {
                if (isElementInViewport(taskElement)) {
                    if (!taskStatus[taskElement.id]) {
                        taskElement.classList.add('active');
                        taskElement.style.opacity = 1;
                        taskElement.style.animation = 'slideInLeftToCenter 1.5s ease-in-out';
                        taskStatus[taskElement.id] = true;
                    }
                }
            });
        }
    
        // Nonaktifkan elemen slide-in di semua section
        function disableSlideInInSection(sectionId) {
            const sectionElement = document.getElementById(sectionId);
            if (sectionElement) {
                const slideInElementsInSection = sectionElement.querySelectorAll('.slide-in');
                slideInElementsInSection.forEach((taskElement) => {
                    taskElement.classList.remove('active');
                    taskElement.style.opacity = 1;
                });
            }
        }
    
        // Nonaktifkan elemen slide-in di semua section
        function disableSlideInInAllSections() {
            sectionIds.forEach((sectionId) => {
                disableSlideInInSection(sectionId);
            });
        }
    
        // Event listener untuk setiap section
        sectionIds.forEach((sectionId) => {
            const sectionElement = document.getElementById(sectionId);
            sectionElement.addEventListener('click', () => {
                disableSlideInInSection(sectionId);
            });
        });
    
        const taskStatus = {};
    
        // Mendeteksi jumlah elemen "task"
        const numberOfTasks = taskElements.length;
    
            // Jika ada 3 elemen atau lebih, aktifkan elemen saat scroll
    if (numberOfTasks >= 3) {
        window.addEventListener('scroll', activateSlideInOnScroll);
    }

    // Tampilkan 3 dari 5 task pada awalnya, dan aktifkan task ke-4 dan ke-5 saat scroll
    if (numberOfTasks > 0) {
        taskElements.forEach((taskElement, index) => {
            if (index < 3) {
                taskElement.classList.add('active');
                taskElement.style.opacity = 1;
                taskElement.style.animation = 'slideInLeftToCenter 1.5s ease-in-out';
            }
        });
    }
    });
    

    const taskThemeClass =
        progress === "Waiting on"
            ? "task-waitingon"
            : progress === "In progress"
            ? "task-inprogress"
            : progress === "Completed"
            ? "task-done"
            : "";

    const dependentNameElement = dependentName
        ? ` <strong>${dependentName}</strong>`
        : "";

    const doneIcon =
        progress === "Completed" ? doneIconSolid : doneIconOutline(id);

    const descriptionElement = description
        ? `<div class="task-desc">${description}</div>`
        : "";

    const toggleTaskIcon =
        progress === "Not started"
            ? startIcon(id)
            : progress === "In progress"
            ? stopIcon(id)
            : "";

    return `
        <div id="task${id}" class="task ${taskThemeClass} slide-in" >
            <div class="task-header">
                <div>
                    <div class="task-progress">${progress}${dependentNameElement}</div>
                    <div class="task-name">${name}</div>
                </div>
                ${doneIcon}
            </div>
            ${descriptionElement}
            <div class="task-footer">
                <div class="task-action">
                    ${deleteIcon(id)}
                    <a href="edit.php?id=${id}">
                        ${editIcon}
                    </a>
                    ${toggleTaskIcon}
                </div>
                <div class="text-upperwide glow">${todoDate}</div>
            </div>
        </div>
    `;
};

// Empty task message
export const emptyTaskMessage = () =>
    `<div class="empty-task">No tasks yet.</div>`;

// Database error
export const systemError = (message, scope = null) => `
    <div class="database-error">
        <div class="text-invalid">
            ${scope ? scope : ERROR.general}
        </div>
        <div class="database-error-msg">
            <code>${message}</code>
        </div>
    </div>
`;

// Error message for empty inputs
export const emptyError = (name) => `${capitalizeFirst(name)} must be filled.`;
