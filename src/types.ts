export type Tag = string;

export type Task = {
  // uid is just the unix timestamp
  id: number;
  date: string;
  tags: Tag[];
  description: string;
};
