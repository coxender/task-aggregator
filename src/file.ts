import { setup } from "./main";
import { isValidTaggFile } from "./types";

if ("launchQueue" in window && "files" in LaunchParams.prototype) {
  window.launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (launchParams.files.length == 0) {
      return;
    }
    openFile(launchParams.files[0]);
  });
}

async function openFile(fileHandle: FileSystemFileHandle) {
  const file = await fileHandle.getFile();

  const json: unknown = JSON.parse(await file.text());

  if (!isValidTaggFile(json)) {
    throw new Error("File is invalid!");
  }

  setup(json.tags, json.tasks);
}
