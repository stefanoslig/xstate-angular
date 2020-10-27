import { Machine, assign } from 'xstate';
import { SubRedditContext, SubRedditSchema } from './subreddit-machine.schema';
import { SubRedditEvent } from './subreddit-machine.events';

export const createSubredditMachine = (subreddit: string) => {
  return Machine<SubRedditContext, SubRedditSchema, SubRedditEvent>(
    {
      id: 'subreddit',
      initial: 'loading',
      context: {
        subreddit,
        posts: null,
        lastUpdated: null
      },
      states: {
        loading: {
          invoke: {
            id: 'fetch-subreddit',
            src: 'invokeFetchSubreddit',
            onDone: {
              target: 'loaded',
              actions: assign({
                posts: (_, event) => event.data,
                lastUpdated: () => Date.now()
              })
            },
            onError: 'failed'
          }
        },
        loaded: {
          on: {
            REFRESH: 'loading'
          }
        },
        failed: {
          on: {
            RETRY: 'loading'
          }
        }
      }
    },
    {
      services: {
        invokeFetchSubreddit: (context, event) =>
          fetch(`https://www.reddit.com/r/${context.subreddit}.json`)
            .then(response => response.json())
            .then(json => json.data.children.map(child => child.data))
      }
    }
  );
};
