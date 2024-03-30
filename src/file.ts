import { setup } from "./main";
import { TaggFile, isValidTaggFile, JSON_SCHEMA, Tag, Task } from "./types";

const dialog = document.querySelector("#startup-dialog") as HTMLDialogElement;
const openButton = dialog.querySelector("#open-button") as HTMLButtonElement;
const createButton = dialog.querySelector("#create-button") as HTMLButtonElement;

const url = new URL(window.location.href);

if (url.searchParams.has("from-file") && "launchQueue" in window && "files" in LaunchParams.prototype) {
  url.searchParams.delete("from-file");
  history.replaceState(undefined, "", url);

  window.launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (launchParams.files.length == 0) {
      throw new Error("where file?");
    }
    openFile(launchParams.files[0]);
  });
} else {
  dialog.showModal();
}

if (!("showOpenFilePicker" in window) || !("showSaveFilePicker" in window)) {
  openButton.disabled = true;
  createButton.disabled = true;
  alert("File tools are not supported by current browser.");
  throw new Error("Our file picker is not supported by your browser, get a better browser (chrome)");
}

openButton.addEventListener("click", async () => {
  const file = await window.showOpenFilePicker({
    id: "tagg",
    startIn: "documents",
    types: [{ accept: { "application/vnd.tagg+json": [".tagg"] } }],
  });
  await openFile(file[0]);
  dialog.close();
});

createButton.addEventListener("click", async () => {
  const file = await window.showSaveFilePicker({
    id: "tagg",
    startIn: "documents",
    types: [{ accept: { "application/vnd.tagg+json": [".tagg"] } }],
  });
  await writeFile(file, [], []);
  await openFile(file);
  dialog.close();
});

dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});

async function openFile(fileHandle: FileSystemFileHandle) {
  const file = await fileHandle.getFile();

  const json: unknown = JSON.parse(await file.text());

  if (!isValidTaggFile(json)) {
    throw new Error("File is invalid!");
  }

  setup(json.tags, json.tasks, (tags, tasks) => {
    writeFile(fileHandle, tags, tasks);
  });
}

async function writeFile(fileHandle: FileSystemFileHandle, tags: Tag[], tasks: Task[]) {
  let data: TaggFile = {
    $schema: JSON_SCHEMA,
    tags,
    tasks,
  };
  let writer = await fileHandle.createWritable();
  await writer.write(JSON.stringify(data));
  await writer.close();
}
