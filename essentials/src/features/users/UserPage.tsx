import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Link, RouteComponentProps } from 'react-router-dom';

import { selectUserById } from './usersSlice';
import { selectPostsByUser } from '../posts/postsSlice';

type IdParam = { userId: string };
export const UserPage = ({ match }: RouteComponentProps<IdParam>) => {
  const { userId } = match.params;

  const user = useAppSelector((state) => selectUserById(state, userId));

  const postsForUser = useAppSelector((state) =>
    selectPostsByUser(state, userId)
  );

  if (!user) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    );
  }

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  );
};
