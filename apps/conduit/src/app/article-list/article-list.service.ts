import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Article } from '../shared/shared.models';
import { ArticleListConfig } from './article-list.models';

@Injectable({ providedIn: 'root' })
export class ArticleListService {
  constructor(private apiService: ApiService) {}

  query(
    type: string,
    config: ArticleListConfig
  ): Observable<{ articles: Article[]; articlesCount: number }> {
    return this.apiService.get(
      '/articles' + (type === 'feed' && !config.filters?.tag ? '/feed' : ''),
      this.toHttpParams(config.filters)
    );
  }

  private toHttpParams(params) {
    return Object.getOwnPropertyNames(params).reduce(
      (p, key) => p.set(key, params[key]),
      new HttpParams()
    );
  }
}
