import { Tag, Task } from "./types";
import { html, render } from "lit";
import { mdiTrashCan, mdiPencil } from "@mdi/js";
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
  clearWarnings();
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
  const hour = getFormattedHours(totalMinutes);
  const minutes = getFormattedMinutes(totalMinutes);
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
        <button @click="${() => editTask(task)}" class="task-edit">
          <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
            <path fill="currentColor" d="${mdiPencil}" />
          </svg>
        </button>
        <span>${task.date} | </span>
        <span>${displayDuration(task.minutes)}</span>
        ${task.tagNames.map(
          (tagName) => html`<span style="--tag-color: ${tagColors[tagName]}" class="tag">${tagName}</span>`,
        )}
        <div class="task-description">${task.description}</div>
      </div>
    `,
  );
  render(templates, tasksListElement);
  save(tags, tasks);
  updateDailyTime();
}

const tagsListElement = document.querySelector("#tags-list") as HTMLElement;
const tagsDropdown = document.querySelector("#tag-dropdown") as HTMLElement;
function updateTags() {
  const tagTemplate = tags.map(
    (tag) =>
      html`<div style="--tag-color: ${tag.color}">
        <span>${tag.name}</span>
        <button type="button" @click="${() => deleteTag(tag.name)}">X</button>
      </div> `,
  );
  const optionsTemplate = tags.map((tag) => html`<option>${tag.name}</option>`);
  render(tagTemplate, tagsListElement);
  render(optionsTemplate, tagsDropdown);
  save(tags, tasks);
}

const dateInput = document.querySelector('#task-form [name="date"]') as HTMLInputElement;
const hourInput = document.querySelector('#task-form [name="hours"]') as HTMLInputElement;
const minuteInput = document.querySelector('#task-form [name="minutes"]') as HTMLInputElement;
const descriptionBox = document.querySelector('#task-form [name="description"]') as HTMLTextAreaElement;
const formWarningBox = document.querySelector("#form-warnings") as HTMLDivElement;

function resetTaskForm() {
  taskForm.reset();
  dateInput.valueAsDate = new Date();
}

function deleteTask(task: Task) {
  tasks = tasks.filter((item) => task != item);
  updateTasks();
}

function editTask(task: Task) {
  tasks = tasks.filter((item) => task != item);

  dateInput.value = task.date;
  minuteInput.valueAsNumber = getFormattedMinutes(task.minutes);
  hourInput.valueAsNumber = getFormattedHours(task.minutes);
  descriptionBox.value = task.description;
  descriptionBox.focus;
  let warningText = html`<span class="warning">This task is unsaved. Submit to re-save this task.</span>`;
  console.log(`${warningText}`);
  render(warningText, formWarningBox);
  updateTasks();
}

function deleteTag(name: string) {
  tags = tags.filter((item) => item.name != name);
  updateTags();
}

function updateDailyTime() {
  const today: Date = new Date();
  //const todayFormatted = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`;
  // get date in YYYY-MM-DD
  let todayFormatted: string = today.toISOString().split("T")[0];
  let todaysTasks = tasks.filter((task) => task.date == todayFormatted);
  let todaysTime = todaysTasks.reduce((accumulator, currentValue) => accumulator + currentValue.minutes, 0);

  const timeTracker = document.querySelector("#time-tracker") as HTMLDivElement;
  const timeTemplate = html`<h3>Daily Time</h3>
    <div>${displayDuration(todaysTime)}</div>`;
  render(timeTemplate, timeTracker);
}

function getFormattedMinutes(totalMinutes: number) {
  return totalMinutes % 60;
}
function getFormattedHours(totalMinutes: number) {
  return Math.floor(totalMinutes / 60);
}

function clearWarnings() {
  render(html``, formWarningBox);
}
