import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SubredditModule } from './subreddit/subreddit.module';
import { XstateAngular } from 'xstate-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, SubredditModule],
  bootstrap: [AppComponent],
  providers: [XstateAngular],
})
export class AppModule {}
