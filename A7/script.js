const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const category = document.getElementById("category");
const taskContainer = document.getElementById("taskContainer");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const themeToggle = document.getElementById("themeToggle");

// Add Task
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = taskInput.value.trim();
    const selectedCategory = category.value;

    if (!title || !selectedCategory) return;

    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    taskCard.innerHTML = `
        <h3>${title}</h3>
        <p>${selectedCategory}</p>

        <div class="btns">
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskContainer.appendChild(taskCard);

    updateCounts();

    taskForm.reset();
});

// Handle Buttons
taskContainer.addEventListener("click", function (e) {

    const card = e.target.closest(".task-card");

    if (!card) return;

    // Delete
    if (e.target.classList.contains("delete-btn")) {
        card.remove();
    }

    // Complete
    if (e.target.classList.contains("complete-btn")) {

        card.classList.toggle("completed");

        if (e.target.textContent === "Complete") {
            e.target.textContent = "Undo";
        } else {
            e.target.textContent = "Complete";
        }
    }

    // Edit
    if (e.target.classList.contains("edit-btn")) {

        const title = card.querySelector("h3");

        const newTitle = prompt(
            "Edit Task",
            title.textContent
        );

        if (newTitle && newTitle.trim()) {
            title.textContent = newTitle.trim();
        }
    }

    updateCounts();
});

// Update Statistics
function updateCounts() {

    const tasks =
        document.querySelectorAll(".task-card");

    const completed =
        document.querySelectorAll(".completed");

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed.length;
    pendingCount.textContent =
        tasks.length - completed.length;
}

// Theme Toggle
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});