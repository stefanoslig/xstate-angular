import { Article } from '../../shared/shared.models';

export class GetArticles {
  readonly type = 'FETCH';
  constructor(public payload: { tabType: string; tag?: string }) {}
}
export class GetArticlesSuccess {
  readonly type = 'FETCH_ARTICLES_SUCCESS';
  constructor(public articles: Article[]) {}
}
export class GetArticlesFail {
  readonly type = 'FETCH_ARTICLES_FAIL';
  constructor(public error: Error) {}
}

export class Favorite {
  readonly type = 'FAVORITE';
  constructor(public slug: string) {}
}
export class FavoriteSuccess {
  readonly type = 'FAVORITE_SUCCESS';
  constructor(public article: Article) {}
}
export class FavoriteFail {
  readonly type = 'FAVORITE_FAIL';
  constructor(public error: Error) {}
}

export class UnFavorite {
  readonly type = 'UNFAVORITE';
  constructor(public slug: string) {}
}
export class UnFavoriteSuccess {
  readonly type = 'UNFAVORITE_SUCCESS';
  constructor(public article: Article) {}
}
export class UnFavoriteFail {
  readonly type = 'UNFAVORITE_FAIL';
  constructor(public error: Error) {}
}

export type ArticleListMachineEvent =
  | GetArticles
  | GetArticlesSuccess
  | GetArticlesFail
  | Favorite
  | FavoriteSuccess
  | FavoriteFail
  | UnFavorite
  | UnFavoriteSuccess
  | UnFavoriteFail;
