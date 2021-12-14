export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  color: string;
};

export type Filter = {
  color: string;
  changeType: string;
};
