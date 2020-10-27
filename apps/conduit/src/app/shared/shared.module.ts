import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from './pager/pager.component';
import { ListErrorsComponent } from './list-errors/list-errors.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PagerComponent, ListErrorsComponent],
  exports: [PagerComponent, ListErrorsComponent],
})
export class SharedModule {}
