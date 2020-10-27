import { Injectable } from '@angular/core';
import { Machine, assign } from 'xstate';
import { XstateAngular } from '@xstate-angular/xstate-angular';
import { environment } from '../../../environments/environment';
import {
  ArticleListMachineContext,
  ArticleListMachineSchema,
} from './article-list-machine.schema';
import {
  ArticleListMachineEvent,
  GetArticlesFail,
  GetArticlesSuccess,
  GetArticles,
} from './article-list-machine.events';
import { ArticleListService } from '../article-list.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const articleListInitialContext: ArticleListMachineContext = {
  articles: [],
  config: {
    currentPage: 1,
    filters: {
      limit: 10,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class ArticleListMachineService {
  constructor(
    private articleListService: ArticleListService,
    private xstateAngular: XstateAngular<
      ArticleListMachineContext,
      ArticleListMachineSchema,
      ArticleListMachineEvent
    >
  ) {}

  private ɵarticleListMachine = Machine<
    ArticleListMachineContext,
    ArticleListMachineSchema,
    ArticleListMachineEvent
  >(
    {
      id: 'article-list',
      context: articleListInitialContext,
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH: 'loading',
            FAVORITE: 'favoriting',
            UNFAVORITE: 'unfavoriting',
          },
        },
        loading: {
          invoke: { src: 'getArticles' },
          on: {
            FETCH_ARTICLES_SUCCESS: {
              target: 'success',
              actions: 'assignResults',
            },
            FETCH_ARTICLES_FAIL: 'fail',
          },
        },
        favoriting: {
          invoke: { src: 'favoriteArticle' },
          on: {
            FAVORITE_SUCCESS: 'success',
            FAVORITE_FAIL: 'fail',
          },
        },
        unfavoriting: {
          invoke: { src: 'unfavoriteArticle' },
          on: {
            UNFAVORITE_SUCCESS: 'success',
            UNFAVORITE_FAIL: 'fail',
          },
        },
        success: {
          on: {
            FETCH: 'loading',
            FAVORITE: 'favoriting',
            UNFAVORITE: 'unfavoriting',
          },
        },
        fail: {
          on: {
            FETCH: 'loading',
          },
        },
      },
    },
    {
      services: {
        getArticles: (context, event: GetArticles) => {
          const config = {
            ...context.config,
            filters: {
              ...context.config.filters,
              tag: event.payload?.tag ?? '',
            },
          };
          return this.articleListService
            .query(event.payload.tabType, config)
            .pipe(
              map((result) => new GetArticlesSuccess(result.articles)),
              catchError((result) => of(new GetArticlesFail(result)))
            );
        },
        favoriteArticle: () => null,
        unfavoriteArticle: () => null,
      },
      actions: {
        assignResults: assign((_, event: ArticleListMachineEvent) => ({
          articles: (event as GetArticlesSuccess).articles,
        })),
      },
    }
  );

  articleListMachine = this.xstateAngular.useMachine(this.ɵarticleListMachine, {
    devTools: !environment.production,
  });
}
