import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubRedditResponse } from './subreddit.model';

@Injectable()
export class SubRedditService {
  constructor(private httpClient: HttpClient) {}

  subreddit(name: string): Observable<SubRedditResponse> {
    return this.httpClient.get<SubRedditResponse>(`https://www.reddit.com/r/${name}.json`);
  }
}
