import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SubReddit } from '../+xstate/reddit-machine.schema';
import { InterpretedService, useService } from '@xstate-angular/xstate-angular';
import {
  SubRedditContext,
  SubRedditSchema,
} from './+xstate/subreddit-machine.schema';
import {
  LoadSubRedditRetry,
  SubRedditEvent,
  LoadSubRedditRefresh,
} from './+xstate/subreddit-machine.events';

@Component({
  selector: 'app-subreddit',
  templateUrl: './subreddit.component.html',
  styleUrls: ['./subreddit.component.scss'],
})
export class SubredditComponent implements OnChanges {
  @Input() subreddit: SubReddit;
  service: InterpretedService<
    SubRedditContext,
    SubRedditSchema,
    SubRedditEvent
  >;

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.subreddit) {
      this.service = useService(this.subreddit);
    }
  }

  retry() {
    this.service.send(new LoadSubRedditRetry());
  }

  refresh() {
    this.service.send(new LoadSubRedditRefresh());
  }
}
