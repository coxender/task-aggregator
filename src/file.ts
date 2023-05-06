import { Tag } from "./types";

/*
Intent
grab Cache to get the directory the file will be at
if there is no cache prompt for directory
prompt and create one
 */
const tagFile = "tags.json";
const tasksFile = "tasks.json";
export function loadTasks() {
  // need secure context, get this working
  let folder = new CacheStorage().open("task-aggregator").then((cache) => {
    cache.match("directory").then((value) => {
      if (value === undefined) {
        return prompt(
          "please enter directory to save information: ",
          "C:\\Users\\chiar\\task_aggr"
        );
      } else {
        return value;
      }
    });
    // get filoes from local storage
    const reader = new FileReader();
  });

  return [{ date: "", tags: [] as Tag[], description: "" }];

  // get files
  // read files
}

export function saveTasks() {}
