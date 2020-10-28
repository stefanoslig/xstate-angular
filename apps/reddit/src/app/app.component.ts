import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RedditEvent, SelectReddit } from './+xstate/reddit-machine.events';
import { XstateAngular } from 'xstate-angular';
import { redditMachine } from './+xstate/reddit-machine.config';
import { RedditContext, RedditSchema } from './+xstate/reddit-machine.schema';

@Component({
  selector: 'xstate-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  subreddits = ['frontend', 'reactjs', 'vuejs', 'angular'];
  redditMachine = this.xstateAngular.useMachine(redditMachine, {
    devTools: true,
  });
  form = new FormGroup({
    subreddit: new FormControl(),
  });

  constructor(
    private xstateAngular: XstateAngular<
      RedditContext,
      RedditSchema,
      RedditEvent
    >
  ) {}

  selectSubReddit(name: string) {
    this.redditMachine.send(new SelectReddit(name));
  }
}
