import { Observable } from 'rxjs';
import {
  EventObject,
  Interpreter,
  State,
  StateConfig,
  StateSchema,
  Typestate,
} from 'xstate';

export interface UseMachineOptions<TContext, TEvent extends EventObject> {
  /**
   * If provided, will be merged with machine's `context`.
   */
  context?: Partial<TContext>;
  /**
   * The state to rehydrate the machine to. The machine will
   * start at this state instead of its `initialState`.
   */
  state?: StateConfig<TContext, TEvent>;
}

export interface InterpretedService<
  TContext,
  TStateSchema extends StateSchema = any,
  TEvent extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> {
  state$: Observable<State<TContext, TEvent, TStateSchema, TTypestate>>;
  send: Interpreter<TContext, TStateSchema, TEvent, TTypestate>['send'];
  service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
}
