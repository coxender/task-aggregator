export type Tag = {
  name: string;
  color: string;
};

export type Task = {
  // uid is just the unix timestamp
  date: string;
  tagNames: Tag["name"][];
  description: string;
};

const JSON_SCHEMA = "https://coxender.github.io/task-aggregator/json-schema/tagg-v1.schema.json";

export type TaggFile = {
  $schema: typeof JSON_SCHEMA;
  tags: Tag[];
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
