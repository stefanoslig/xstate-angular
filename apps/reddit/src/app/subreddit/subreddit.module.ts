import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SubredditComponent } from './subreddit.component';

@NgModule({
  declarations: [SubredditComponent],
  exports: [SubredditComponent],
  imports: [BrowserModule]
})
export class SubredditModule {}
