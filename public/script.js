const API_URL = '/api/tasks';

const taskForm = document.getElementById('task-form');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const tasksTableBody = document.getElementById('tasks-table-body');

const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusSelect = document.getElementById('status');

function getTaskId(task) {
  return task._id || task.id || '';
}

taskForm.addEventListener("submit", (e) => e.preventDefault());

// Cargar tareas al iniciar
window.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  tasksTableBody.innerHTML = '';

  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();

    tasks.forEach((task) => {
      const id = getTaskId(task);
      const tr = document.createElement('tr');

      let claseEstado = "";
      if (task.status === "pendiente") claseEstado = "estado-pendiente";
      if (task.status === "en_progreso") claseEstado = "estado-en-progreso";
      if (task.status === "completada") claseEstado = "estado-completada";

      tr.innerHTML = `
        <td>${task.title}</td>
        <td>${task.description || ''}</td>
        <td class="${claseEstado}">${task.status}</td>
        <td>
          <button class="editar" onclick="editTask('${id}')">Editar</button>
          <button class="eliminar" onclick="deleteTask('${id}')">Eliminar</button>
        </td>
      `;

      tasksTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error al cargar tareas', err);
  }
}

// Guardar (crear o actualizar)
saveBtn.addEventListener("click", async () => {
  const id = taskIdInput.value.trim();

  const taskData = {
    title: titleInput.value,
    description: descriptionInput.value,
    status: statusSelect.value,
  };

  try {
    if (id) {
      // Actualizar
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      alert("Tarea actualizada correctamente");

    } else {
      // Crear
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error('Error al crear');
      alert("Tarea creada correctamente");
    }

    resetForm();
    loadTasks();

  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al guardar la tarea');
  }
});

// Limpiar formulario
resetBtn.addEventListener('click', resetForm);

function resetForm() {
  taskIdInput.value = '';
  titleInput.value = '';
  descriptionInput.value = '';
  statusSelect.value = 'pendiente';
}

// Editar tarea
async function editTask(id) {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const task = tasks.find((t) => getTaskId(t) === id);

    if (!task) return;

    taskIdInput.value = getTaskId(task);
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    statusSelect.value = task.status;

  } catch (err) {
    console.error('Error al editar tarea', err);
  }
}

// Eliminar tarea
async function deleteTask(id) {
  if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar');

    alert("Tarea eliminada correctamente");
    loadTasks();

  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al eliminar la tarea');
  }
}
