import {
  EventObject,
  State,
  Interpreter,
  Typestate,
  StateSchema,
} from 'xstate';
import { filter, finalize, shareReplay } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

export function useService<
  TContext,
  TStateSchema extends StateSchema = any,
  TEvent extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
>(
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>
): {
  state$: Observable<State<TContext, TEvent, TStateSchema, TTypestate>>;
  send: Interpreter<TContext, TStateSchema, TEvent, TTypestate>['send'];
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
} {
  const _state$ = new BehaviorSubject(service.state);
  const sub = service.subscribe((s) => _state$.next(s));

  const state$ = _state$.pipe(
    filter(({ changed }) => changed),
    shareReplay(1),
    finalize(() => {
      sub.unsubscribe();
    })
  );

  return { state$, send: service.send, service };
}
