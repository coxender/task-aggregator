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
let save: (tags: Tag[], tasks: Task[]) => void;

export function setup(newTags: Tag[], newTasks: Task[], newSave: (tags: Tag[], tasks: Task[]) => void) {
  tags = newTags;
  tasks = newTasks;
  save = newSave;
  updateTags();
  updateTasks();
  resetTaskForm();
}

const taskForm = document.querySelector("#task-form") as HTMLFormElement;
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(taskForm);
  const date = data.get("date") as string;
  const hours = parseInt(data.get("hours") as string);
  const minutes = parseInt(data.get("minutes") as string);
  const tagNames = data.getAll("tagNames") as Tag["name"][];
  const description = data.get("description") as string;

  tasks.unshift({ date, minutes: hours * 60 + minutes, tagNames, description });

  updateTasks();

  // clear tags and description in form
  resetTaskForm();
});

const tagForm = document.querySelector("#tag-form") as HTMLFormElement;
tagForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(tagForm);
  const name = data.get("name") as string;
  const color = data.get("color") as string;

  let errorText = document.querySelector("#tag-submission-error-text") as HTMLElement;
  if (tags.some((tag) => tag.name === name)) {
    errorText.innerHTML = "Cannot have duplicate tags!!";
  } else {
    errorText.innerHTML = "";
    tagForm.reset();
    tags.push({ name, color });
    updateTags();
  }
});

const tasksListElement = document.querySelector("#tasks-list") as HTMLElement;

function displayDuration(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hour} hr ${minutes < 10 ? "0" + minutes : minutes} min`;
}

function updateTasks() {
  let tagColors: { [name: string]: string } = Object.fromEntries(tags.map((tag) => [tag.name, tag.color]));
  const templates = tasks.map(
    (task) => html`
      <div class="task">
        <button @click="${() => deleteTask(task)}" class="task-delete">
          <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
            <path fill="currentColor" d="${mdiTrashCan}" />
          </svg>
        </button>
        <span>${task.date} | </span>
        <span>${displayDuration(task.minutes)}</span>
        ${task.tagNames.map(
          (tagName) => html`<span style="--tag-color: ${tagColors[tagName]}" class="tag">${tagName}</span>`
        )}
        <textarea
          class="task-description"
          @change="${(event: Event) => (task.description = (event.target as HTMLTextAreaElement).value)}"
          .value="${task.description}"
          rows="5"
          cols="80"
        ></textarea>
      </div>
    `
  );
  render(templates, tasksListElement);
  save(tags, tasks);
}

const tagsListElement = document.querySelector("#tags-list") as HTMLElement;
const tagsDropdown = document.querySelector("#tag-dropdown") as HTMLElement;
function updateTags() {
  const tagTemplate = tags.map(
    (tag) =>
      html`<div style="--tag-color: ${tag.color}">
        <span>${tag.name}</span>
        <button type="button" @click="${() => deleteTag(tag.name)}">X</button>
      </div> `
  );
  const optionsTemplate = tags.map((tag) => html`<option>${tag.name}</option>`);
  render(tagTemplate, tagsListElement);
  render(optionsTemplate, tagsDropdown);
  save(tags, tasks);
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

function deleteTag(name: string) {
  tags = tags.filter((item) => item.name != name);
  updateTags();
}
