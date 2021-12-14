import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Link, RouteComponentProps } from 'react-router-dom';

import { selectPostById } from './postsSlice';

type IdParam = { postId: string };
export const SinglePostPage = ({ match }: RouteComponentProps<IdParam>) => {
  const { postId } = match.params;

  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className='post'>
        <h2>{post.title}</h2>
        <p className='post-content'>{post.content}</p>
        <Link to={`/editPost/${post.id}`} className='button'>
          Edit Post
        </Link>
      </article>
    </section>
  );
};
