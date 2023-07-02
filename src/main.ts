import { Tag, Task } from "./types";
import { html, render } from "lit";

// prevent default submit
// add new tags
// delet tags
// file to and file from functions

let tasks: Task[] = [
  {
    id: 1688321006071,
    date: "10-03-03",
    tags: ["work", "play"],
    description: "This is a Task ",
  },
];
let tags: Tag[] = ["work", "play", "other"];
const taskForm = document.querySelector("#task-form") as HTMLFormElement;
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(taskForm);
  const date = data.get("date") as string;
  const tags = data.getAll("tags") as Tag[];
  const description = data.get("description") as string;

  tasks.unshift({ id: Date.now(), date, tags, description });

  updateTasks();

  // clear tags and description in form
  resetTaskForm();
});

const tagForm = document.querySelector("#tag-form") as HTMLFormElement;
tagForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(tagForm);
  const tag = data.get("tag") as Tag;

  let errorText = document.querySelector(
    "#tag-submission-error-text"
  ) as HTMLElement;
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
      <div>
        <button
          id="task-edit-${task.id}"
          @click="${() => deleteTask(task.id)}"
          class="task-delete"
        >
          X
        </button>
        <span hidden>${task.id}</span>
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

const dateInput = document.querySelector(
  '#task-form [name="date"]'
) as HTMLInputElement;

function resetTaskForm() {
  taskForm.reset();
  dateInput.valueAsDate = new Date();
}

function deleteTask(id: number) {
  tasks = tasks.filter((item) => item.id != id);
  updateTasks();
}

function deleteTag(tag: string) {
  tags = tags.filter((item) => item != tag);
  updateTags();
}

resetTaskForm();
updateTasks();
updateTags();
