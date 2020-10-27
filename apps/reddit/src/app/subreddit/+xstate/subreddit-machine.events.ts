export class LoadSubRedditRefresh {
  readonly type = 'REFRESH';
}
export class LoadSubRedditRetry {
  readonly type = 'RETRY';
}

export type SubRedditEvent = LoadSubRedditRefresh | LoadSubRedditRetry;
