import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArticleListItemComponent } from './article-list-item/article-list-item.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleListService } from './article-list.service';
import { ArticleListMachineFacade } from './+xstate/article-list-machine.facade';
import { ArticleListMachineService } from './+xstate/article-list-machine.config';
import { XstateAngular } from '@xstate-angular/xstate-angular';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ArticleListComponent, ArticleListItemComponent],
  providers: [
    ArticleListService,
    ArticleListMachineFacade,
	ArticleListMachineService,
	XstateAngular
  ],
  exports: [ArticleListComponent],
})
export class ArticleListModule {}
