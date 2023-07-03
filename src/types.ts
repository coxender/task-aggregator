export type Tag = string;

export type Task = {
  // uid is just the unix timestamp
  date: string;
  tags: Tag[];
  description: string;
};
