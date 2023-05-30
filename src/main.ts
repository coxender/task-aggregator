import { Tag, Task } from "./types";
import { html, render } from "lit";

// prevent default submit
// add new tags
// delet tags
// file to and file from functions

const tasks: Task[] = [
  { date: "10-03-03", tags: ["work", "play"], description: "This is a Task " },
];
const tags: Tag[] = ["work", "play", "other"];
const taskForm = document.querySelector("#task-form") as HTMLFormElement;
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(taskForm);
  const date = data.get("date") as string;
  const tags = data.getAll("tags") as Tag[];
  const description = data.get("description") as string;

  tasks.unshift({ date, tags, description });

  updateTasks();

  // clear tags and description in form
  resetTaskForm();
});

const tagForm = document.querySelector("#tag-form") as HTMLFormElement;
tagForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(tagForm);
  tags.push(data.get("tag") as Tag);

  updateTags();
});

const tasksListElement = document.querySelector("#tasks-list") as HTMLElement;

function updateTasks() {
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

const tagsListElement = document.querySelector("#tags-list") as HTMLElement;
const tagsDropdown = document.querySelector("#tag-dropdown") as HTMLElement;
function updateTags() {
  const tagTemplate = tags.map(
    (tag) => html`<div><span>${tag}</span><button>X</button></div> `
  );
  const optionsTemplate = tags.map((tag) => html`<option>${tag}</option>`);
  render(tagTemplate, tagsListElement);
  render(optionsTemplate, tagsDropdown);
}

const dateInput = document.querySelector(
  '#task-form [name="date"]'
) as HTMLInputElement;

function resetTaskForm() {
  taskForm.reset();
  dateInput.valueAsDate = new Date();
}

resetTaskForm();
updateTasks();
updateTags();
