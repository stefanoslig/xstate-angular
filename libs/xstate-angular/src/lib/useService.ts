import {
  EventObject,
  State,
  Interpreter,
  Typestate,
  StateSchema,
} from 'xstate';
import { filter, finalize, shareReplay } from 'rxjs/operators';
import { Observable, from, BehaviorSubject } from 'rxjs';

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
  const state$ = new BehaviorSubject(service.state);
  const sub = service.subscribe((s) => state$.next(s));

  state$.pipe(
    filter(({ changed }) => changed),
    shareReplay(1),
    finalize(() => sub.unsubscribe())
  );

  return { state$, send: service.send, service };
}
