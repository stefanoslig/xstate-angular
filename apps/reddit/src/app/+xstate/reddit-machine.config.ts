import { Machine, assign, spawn } from 'xstate';
import { RedditContext, RedditSchema } from './reddit-machine.schema';
import { RedditEvent } from './reddit-machine.events';
import { createSubredditMachine } from '../subreddit/+xstate/subreddit-machine.config';

export const redditMachine = Machine<RedditContext, RedditSchema, RedditEvent>({
  id: 'reddit',
  initial: 'idle',
  context: {
    subreddits: {},
    subreddit: null,
  },
  states: { idle: {}, selected: {} },
  on: {
    SELECT: {
      target: '.selected',
      actions: assign((context, event) => {
        let subreddit = context.subreddits[event.name];

        if (subreddit) {
          return {
            ...context,
            subreddit,
          };
        }

        subreddit = spawn(createSubredditMachine(event.name));

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit,
          },
          subreddit,
        };
      }),
    },
  },
});
