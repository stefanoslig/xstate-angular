import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LifetimeComponent } from './lifetime.component';
import { CommonModule } from '@angular/common';
import { AComponent } from './a.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LifetimeComponent, AComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: LifetimeComponent }]),
  ],
  providers: [],
})
export class LifetimeModule {}
