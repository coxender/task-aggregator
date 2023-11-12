export type Tag = {
  /** The name of the tag. */
  name: string;
  /** An srgb hexadecimal color e.g. `#ff00ff` */
  color: string;
};

export type Task = {
  /** The date of the task. (YYYY-MM-DD) */
  date: string;
  /** The duration of the task in minutes. */
  minutes: number;
  /** The names of the tags attached to a task. */
  tagNames: Tag["name"][];
  /** The description of the task. */
  description: string;
};

const JSON_SCHEMA = "https://coxender.github.io/task-aggregator/json-schema/tagg-v1.schema.json";

export type TaggFile = {
  $schema: typeof JSON_SCHEMA;
  /** The list of current tags */
  tags: Tag[];
  /** The past recorded tasks. */
  tasks: Task[];
};

export function isValidTaggFile(json: unknown): json is TaggFile {
  if (typeof json != "object" || json == null) {
    return false;
  }

  if (!("$schema" in json) || json.$schema != JSON_SCHEMA) {
    return false;
  }

  return true;
}
