const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const errorMsg = document.getElementById('error-msg');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');

let tasks = [];

let editingId = null;

function handleTaskSubmit() {
    const text = taskInput.value.trim();

    if (text === "") {
        errorMsg.className = "error-visible";
        taskInput.style.borderColor = "var(--error)";
        return;
    }

    errorMsg.className = "error-hidden";
    taskInput.style.borderColor = "";

    if (editingId !== null) {
        tasks = tasks.map(task => {
            if (task.id === editingId) {
                return { ...task, text: text };
            }
            return task;
        });
        editingId = null;
        addBtn.textContent = "Agregar";
    } else {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
    }

    taskInput.value = "";
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    if (editingId === id) {
        editingId = null;
        taskInput.value = "";
        addBtn.textContent = "Agregar";
        errorMsg.className = "error-hidden";
        taskInput.style.borderColor = "";
    }
    renderTasks();
}

function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
        taskInput.value = taskToEdit.text;
        editingId = id;
        addBtn.textContent = "Guardar";
        taskInput.focus();
        errorMsg.className = "error-hidden";
        taskInput.style.borderColor = "";
    }
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${escapeHtml(task.text)}</span>
            </div>
            <div class="buttons-group">
                <button class="action-btn edit-btn" onclick="editTask(${task.id})">Editar</button>
                <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

addBtn.addEventListener('click', handleTaskSubmit);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleTaskSubmit();
    }
});

renderTasks();