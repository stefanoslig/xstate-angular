import { SubRedditData } from '../subreddit.model';

export interface SubRedditSchema {
  states: {
    loading: {};
    loaded: {};
    failed: {};
  };
}

export interface SubRedditContext {
  subreddit: string;
  posts: SubRedditData[];
  lastUpdated: number;
}
