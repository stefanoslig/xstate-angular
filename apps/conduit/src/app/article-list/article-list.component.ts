import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleListMachineFacade } from './+xstate/article-list-machine.facade';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListComponent implements OnChanges {
  @Input() type = 'all';
  @Input() tag: string;
  totalPages$: Observable<number[]>;
  articles$ = this.articleListMachineFacade.articles$;
  isLoading$: Observable<boolean>;

  constructor(private articleListMachineFacade: ArticleListMachineFacade) {}

  ngOnChanges() {
    this.articleListMachineFacade.loadArticles(this.type, this.tag);
  }

  favorite(slug: string) {
    this.articleListMachineFacade.favorite(slug);
  }

  unFavorite(slug: string) {
    this.articleListMachineFacade.unFavorite(slug);
  }

  setPage(page: number) {
    this.articleListMachineFacade.setPage(page);
  }
}
