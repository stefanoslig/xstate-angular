export interface HomeMachineSchema {
  states: {
    checking: {};
    feed: {};
    all: {};
    tag: {};
  };
}

export interface HomeMachineContext {
  tags: string[];
  selectedTag: string;
}
