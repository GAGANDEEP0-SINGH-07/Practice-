// Select HTML elements
let form = document.querySelector("#taskForm");
let taskContainer = document.querySelector(".task-container");
let input = document.querySelector(".input-title");
let select = document.querySelector(".category");
let themeButton = document.querySelector(".nav-right");
let themeIcon = document.querySelector(".nav-right i");
let total = document.querySelector(".total");
let completed = document.querySelector(".completed");
let pending = document.querySelector(".pending");
let submitText = document.querySelector(".add-task .button-label");

let tasks = JSON.parse(localStorage.getItem("savedTask")) || [];
let editId = null;

// Save tasks in the browser
function saveTasks() {
  localStorage.setItem("savedTask", JSON.stringify(tasks));
}

// Update total, completed, and pending numbers
function updateCounter() {
  let completedTasks = tasks.filter((task) => task.status === "Completed");

  total.textContent = tasks.length;
  completed.textContent = completedTasks.length;
  pending.textContent = tasks.length - completedTasks.length;
}

function escapeHTML(text) {
  let div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Show all tasks on the page
function renderTasks() {
  taskContainer.innerHTML = "";

  if (tasks.length === 0) {
    taskContainer.innerHTML = `<p class="empty-state">No tasks yet. Add your first task above.</p>`;
    updateCounter();
    return;
  }

  tasks.forEach((task) => {
    let completeText = task.status === "Completed" ? "Undo" : "Complete";
    let completeIcon =
      task.status === "Completed" ? "ri-arrow-go-back-line" : "ri-check-line";

    taskContainer.innerHTML += `
      <article class="task-card" data-id="${task.id}" data-status="${task.status}">
        <div class="task-top">
          <h2>${escapeHTML(task.title)}</h2>
          <span class="badge">${escapeHTML(task.category)}</span>
        </div>

        <p class="status">${task.status}</p>

        <div class="btns">
          <button class="edit" type="button">
            <i class="ri-edit-line" aria-hidden="true"></i>
            <span class="button-label">Edit</span>
          </button>
          <button class="complete" type="button">
            <i class="${completeIcon}" aria-hidden="true"></i>
            <span class="button-label">${completeText}</span>
          </button>
          <button class="delete" type="button">
            <i class="ri-delete-bin-line" aria-hidden="true"></i>
            <span class="button-label">Delete</span>
          </button>
        </div>
      </article>
    `;
  });

  updateCounter();
}

function resetForm() {
  form.reset();
  editId = null;
  submitText.textContent = "Add Task";
}

// Add a new task or update the task being edited
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let title = input.value.trim();
  let category = select.value;

  if (title === "" || category === "") {
    alert("Please fill all fields.");
    return;
  }

  if (editId) {
    let taskToEdit = tasks.find((task) => String(task.id) === editId);
    taskToEdit.title = title;
    taskToEdit.category = category;
  } else {
    tasks.push({
      id: Date.now(),
      title: title,
      category: category,
      status: "Pending",
    });
  }

  saveTasks();
  renderTasks();
  resetForm();
});

// Handle edit, complete, and delete buttons
taskContainer.addEventListener("click", function (event) {
  let button = event.target.closest("button");
  let card = event.target.closest(".task-card");

  if (!button || !card) {
    return;
  }

  let id = card.dataset.id;
  let currentTask = tasks.find((task) => String(task.id) === id);

  if (button.classList.contains("complete")) {
    currentTask.status =
      currentTask.status === "Pending" ? "Completed" : "Pending";
  }

  if (button.classList.contains("delete")) {
    tasks = tasks.filter((task) => String(task.id) !== id);
  }

  if (button.classList.contains("edit")) {
    input.value = currentTask.title;
    select.value = currentTask.category;
    editId = id;
    submitText.textContent = "Update Task";
    return;
  }

  saveTasks();
  renderTasks();
});

// Dark/light theme button
themeButton.addEventListener("click", function () {
  if (document.body.dataset.theme === "dark") {
    document.body.dataset.theme = "light";
    themeIcon.className = "ri-moon-fill";
    themeButton.setAttribute("aria-label", "Switch to dark theme");
  } else {
    document.body.dataset.theme = "dark";
    themeIcon.className = "ri-sun-fill";
    themeButton.setAttribute("aria-label", "Switch to light theme");
  }

  localStorage.setItem("theme", document.body.dataset.theme);
});

let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.dataset.theme = "dark";
  themeIcon.className = "ri-sun-fill";
  themeButton.setAttribute("aria-label", "Switch to light theme");
}

renderTasks();
