import { ArticleListMachineEvent } from '../../article-list/+xstate/article-list-machine.events';

export class ActivateFeedTab {
  readonly type = 'ACTIVATE_FEED_TAB';
}
export class ActivateAllTab {
  readonly type = 'ACTIVATE_ALL_TAB';
}
export class ActivateTagTab {
  readonly type = 'ACTIVATE_TAG_TAB';
  constructor(public tag: string) {}
}
export class IsAnauthorizedCheck {
  readonly type = 'IS_ANAUTHORIZED_CHECK';
}
export class IsAnauthorized {
  readonly type = 'IS_ANAUTHORIZED';
}
export class IsAuthorized {
  readonly type = 'IS_AUTHORIZED';
}
export class GetTags {
  readonly type = 'GET_TAGS';
}
export class GetTagsSuccess {
  readonly type = 'GET_TAGS_SUCCESS';
  constructor(public tags: string[]) {}
}
export class GetTagsFailure {
  readonly type = 'GET_TAGS_FAILURE';
  constructor(public error: Error) {}
}

export type HomeMachineEvent =
  | ActivateFeedTab
  | ActivateAllTab
  | ActivateTagTab
  | IsAnauthorizedCheck
  | IsAnauthorized
  | IsAuthorized
  | GetTagsSuccess
  | ArticleListMachineEvent;
