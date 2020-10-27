export class SelectReddit {
  readonly type = 'SELECT';
  constructor(public name: string) {}
}

export type RedditEvent = SelectReddit;
