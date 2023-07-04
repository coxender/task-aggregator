import { Tag, Task } from "./types";
import { html, render } from "lit";
import { mdiTrashCan } from "@mdi/js";
import "./file";

// prevent default submit
// add new tags
// delete tags
// file to and file from functions

let tasks: Task[] = [];
let tags: Tag[] = [];

export function setup(newTags: Tag[], newTasks: Task[]) {
  tags = newTags;
  tasks = newTasks;
  updateTags();
  updateTasks();
}

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
  const tag = data.get("tag") as Tag;

  let errorText = document.querySelector("#tag-submission-error-text") as HTMLElement;
  if (tags.includes(tag)) {
    errorText.innerHTML = "Cannot have duplicate tags!!";
  } else {
    errorText.innerHTML = "";
    tagForm.reset();
    tags.push(tag);
    updateTags();
  }
});

const tasksListElement = document.querySelector("#tasks-list") as HTMLElement;

function updateTasks() {
  const templates = tasks.map(
    (task) => html`
      <div class="task">
        <button @click="${() => deleteTask(task)}" class="task-delete">
          <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
            <path fill="currentColor" d="${mdiTrashCan}" />
          </svg>
        </button>
        <span>${task.date}</span>
        ${task.tags.map((tag) => html`<span class="tag">${tag}</span>`)}
        <textarea
          class="task-description"
          @change="${(event: Event) => (task.description = (event.target as HTMLTextAreaElement).value)}"
          .value="${task.description}"
        ></textarea>
      </div>
    `
  );
  render(templates, tasksListElement);
}

const tagsListElement = document.querySelector("#tags-list") as HTMLElement;
const tagsDropdown = document.querySelector("#tag-dropdown") as HTMLElement;
function updateTags() {
  const tagTemplate = tags.map(
    (tag) =>
      html`<div>
        <span>${tag}</span>
        <button type="button" @click="${() => deleteTag(tag)}">X</button>
      </div> `
  );
  const optionsTemplate = tags.map((tag) => html`<option>${tag}</option>`);
  render(tagTemplate, tagsListElement);
  render(optionsTemplate, tagsDropdown);
}

const dateInput = document.querySelector('#task-form [name="date"]') as HTMLInputElement;

function resetTaskForm() {
  taskForm.reset();
  dateInput.valueAsDate = new Date();
}

function deleteTask(task: Task) {
  tasks = tasks.filter((item) => task != item);
  updateTasks();
}

function deleteTag(tag: string) {
  tags = tags.filter((item) => item != tag);
  updateTags();
}

resetTaskForm();
updateTasks();
updateTags();
