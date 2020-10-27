import { Interpreter } from 'xstate';
import { SubRedditContext } from '../subreddit/+xstate/subreddit-machine.schema';
import { SubRedditEvent } from '../subreddit/+xstate/subreddit-machine.events';

export interface RedditSchema {
  states: {
    idle: {};
    selected: {};
  };
}

export interface RedditContext {
  subreddit: SubReddit;
  subreddits: SubReddits;
}

export interface SubReddits {
  [key: string]: SubReddit;
}

export type SubReddit = Interpreter<SubRedditContext, any, SubRedditEvent, any>;
