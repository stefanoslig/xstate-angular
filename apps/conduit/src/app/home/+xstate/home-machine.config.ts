import { Injectable } from '@angular/core';
import { Machine, assign } from 'xstate';
import { XstateAngular } from '@xstate-angular/xstate-angular';
import { environment } from '../../../environments/environment';
import { HomeMachineContext, HomeMachineSchema } from './home-machine.schema';
import {
  HomeMachineEvent,
  IsAnauthorized,
  IsAuthorized,
  GetTagsSuccess,
  GetTagsFailure,
  ActivateTagTab,
} from './home-machine.events';
import { AuthMachineFacade } from '../../auth/+xstate/auth-machine.facade';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HomeService } from '../home.service';

export const homeInitialContext: HomeMachineContext = {
  tags: [],
  selectedTag: null,
};

@Injectable({ providedIn: 'root' })
export class HomeMachineService {
  constructor(
    private authMachineFacade: AuthMachineFacade,
    private homeService: HomeService,
    private xstateAngular: XstateAngular<
      HomeMachineContext,
      HomeMachineSchema,
      HomeMachineEvent
    >
  ) {}

  private ɵhomeMachine = Machine<
    HomeMachineContext,
    HomeMachineSchema,
    HomeMachineEvent
  >(
    {
      id: 'home',
      context: homeInitialContext,
      initial: 'checking',
      invoke: { src: 'getTags' },
      states: {
        checking: {
          invoke: { src: 'isAnauthorized' },
          on: {
            IS_ANAUTHORIZED: { target: 'all' },
            IS_AUTHORIZED: { target: 'feed' },
          },
        },
        all: { entry: 'resetTag' },
        feed: { entry: 'resetTag' },
        tag: {},
      },
      on: {
        GET_TAGS_SUCCESS: { actions: 'assignTags' },
        ACTIVATE_FEED_TAB: { target: 'checking' },
        ACTIVATE_ALL_TAB: { target: 'all' },
        ACTIVATE_TAG_TAB: { target: 'tag', actions: ['assignTag'] },
      },
    },
    {
      services: {
        isAnauthorized: () =>
          this.authMachineFacade.isAnauthorized$.pipe(
            map((anauthorized) =>
              anauthorized ? new IsAnauthorized() : new IsAuthorized()
            )
          ),
        getTags: () =>
          this.homeService.getTags().pipe(
            map((result) => new GetTagsSuccess(result.tags)),
            catchError((result) => of(new GetTagsFailure(result)))
          ),
      },
      actions: {
        assignTags: assign((_, event: HomeMachineEvent) => ({
          tags: (event as GetTagsSuccess).tags,
        })),
        assignTag: assign((_, event: HomeMachineEvent) => ({
          selectedTag: (event as ActivateTagTab).tag,
        })),
        resetTag: assign((_, event) => ({
          selectedTag: null,
        })),
      },
    }
  );

  homeMachine = this.xstateAngular.useMachine(this.ɵhomeMachine, {
    devTools: !environment.production,
  });
}
