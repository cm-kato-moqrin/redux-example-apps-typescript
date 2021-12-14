export type User = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
};

export type Post = {
  id: string;
  title: string;
  date: string;
  content: string;
  reactions: Reaction;
  comments: Comment[];
  user: string;
};

export type Comment = {
  id: string;
  date: string;
  text: string;
  post: Post;
};

export type Reaction = {
  thumbsUp: number;
  hooray: number;
  heart: number;
  rocket: number;
  eyes: number;
};

export type Notification = {
  id: string;
  date: string;
  message: string;
  userId: string;
  read: boolean;
  isNew: boolean;
};
