import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { Post, Reaction } from '../../app/types';

import { reactionAdded } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='muted-button reaction-button'
        onClick={() =>
          dispatch(
            reactionAdded({ postId: post.id, reaction: name as keyof Reaction })
          )
        }
      >
        {emoji} {post.reactions[name as keyof Reaction]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
