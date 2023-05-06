import { Tag, Task } from "./types";
import { html, render } from "lit";
import { loadTasks, saveTasks } from "./file";

// prevent default submit
// add new tags
// delet tags
// file to and file from functions

const tasks: Task[] = loadTasks();
const taskForm = document.querySelector("#task-form") as HTMLFormElement;
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(taskForm);
  const date = data.get("date") as string;
  const tags = data.getAll("tags") as Tag[];
  const description = data.get("description") as string;

  tasks.unshift({ date, tags, description });

  update();

  // clear tags and description in form
  resetTaskForm();
});

const tasksListElement = document.querySelector("#tasks-list") as HTMLElement;

function update() {
  const templates = tasks.map(
    (task) => html`
      <div>
        <span>${task.date}</span>
        ${task.tags.map((tag) => html`<span class="tag">${tag}</span>`)}
        <span>${task.description}</span>
      </div>
    `
  );
  render(templates, tasksListElement);
}

const dateInput = document.querySelector('#task-form [name="date"]') as HTMLInputElement;
function resetTaskForm() {
  taskForm.reset();
  dateInput.valueAsDate = new Date();
}

resetTaskForm();
