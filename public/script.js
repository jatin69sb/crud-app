// script.js
// Handles talking to the /api/tasks REST API and rendering the task list.

const form = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const taskList = document.getElementById('task-list');

const API_URL = '/api/tasks';

// Load tasks when the page opens
document.addEventListener('DOMContentLoaded', loadTasks);

// Handle Create / Update form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const task = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value,
  };

  const id = taskIdInput.value;

  try {
    if (id) {
      // UPDATE existing task
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    } else {
      // CREATE new task
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
    }

    resetForm();
    loadTasks();
  } catch (err) {
    alert('Something went wrong. Check the console for details.');
    console.error(err);
  }
});

cancelBtn.addEventListener('click', resetForm);

// READ: fetch all tasks and render them
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="empty-message">No tasks yet. Add one above!</p>';
    return;
  }

  tasks.forEach((task) => {
    const card = document.createElement('div');
    card.className = 'task-card';

    card.innerHTML = `
      <div class="task-info">
        <h3>${escapeHtml(task.title)}</h3>
        ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
        <span class="status-badge status-${task.status}">${task.status}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    taskList.appendChild(card);
  });

  // Attach edit/delete handlers
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => startEdit(btn.dataset.id, tasks));
  });
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteTask(btn.dataset.id));
  });
}

// Fill the form with an existing task's data for editing
function startEdit(id, tasks) {
  const task = tasks.find((t) => String(t.id) === String(id));
  if (!task) return;

  taskIdInput.value = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || '';
  statusInput.value = task.status;

  submitBtn.textContent = 'Update Task';
  cancelBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DELETE a task
async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTasks();
}

function resetForm() {
  form.reset();
  taskIdInput.value = '';
  submitBtn.textContent = 'Add Task';
  cancelBtn.classList.add('hidden');
}

// Basic escaping to avoid breaking HTML when rendering user input
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
