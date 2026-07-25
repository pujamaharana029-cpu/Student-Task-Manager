const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const search = document.getElementById("search");
const counter = document.getElementById("counter");
const clearCompleted = document.getElementById("clearCompleted");
const successMessage = document.getElementById("successMessage");
const filterBtns = document.querySelectorAll(".filter-btn");
const date = document.getElementById("date");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const themeBtn = document.getElementById("themeBtn");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Show current date
const today = new Date();
date.textContent = today.toDateString();

displayTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

search.addEventListener("input", displayTasks);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        displayTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    displayTasks();
});

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

function displayTasks() {

    taskList.innerHTML = "";
    if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    } else {
    emptyMessage.style.display = "none";
    }
    const completedCount = tasks.filter(task => task.completed).length;

     if (tasks.length > 0 && completedCount === tasks.length) {
    successMessage.style.display = "block";
    } else {
    successMessage.style.display = "none";
    }
    const keyword = search.value.toLowerCase();

    let filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(keyword)
    );

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {

        const originalIndex = tasks.indexOf(task);

        const li = document.createElement("li");

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("complete");
        }

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeBtn = document.createElement("button");
        completeBtn.classList.add("complete-btn");
        completeBtn.innerHTML = "✔";
        completeBtn.onclick = () => {
            tasks[originalIndex].completed = !tasks[originalIndex].completed;
            saveTasks();
            displayTasks();
        };

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.innerHTML = "✏";
        editBtn.onclick = () => {
            const updated = prompt("Edit Task", task.text);

            if (updated && updated.trim() !== "") {
                tasks[originalIndex].text = updated.trim();
                saveTasks();
                displayTasks();
            }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");                                                                                                                                                           
        deleteBtn.innerHTML = "🗑";
        deleteBtn.onclick = () => {
            tasks.splice(originalIndex, 1);
            saveTasks();
            displayTasks();
        };

        actions.append(completeBtn, editBtn, deleteBtn);

        li.append(span, actions);

        taskList.appendChild(li);
    });

    counter.textContent = `${tasks.length} Task(s)`;
//progress bar
    const completed = tasks.filter(task => task.completed).length;
    const percentage =
    tasks.length === 0
    ? 0
    : Math.round((completed / tasks.length) * 100);

    progressFill.style.width = percentage + "%";
    progressText.textContent = percentage + "%";
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

themeBtn.onclick = () => {

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){
themeBtn.innerHTML="☀ Light Mode";
}else{
themeBtn.innerHTML="🌙 Dark Mode";
}

};