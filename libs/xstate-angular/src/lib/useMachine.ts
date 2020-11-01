import { Injectable } from '@angular/core';
import { OnDestroy } from '@angular/core';
import {
  EventObject,
  MachineOptions,
  interpret,
  State,
  InterpreterOptions,
  Interpreter,
  StateMachine,
  Typestate,
} from 'xstate';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { from, ReplaySubject } from 'rxjs';
import { InterpretedService, UseMachineOptions } from './types';

@Injectable()
export class XstateAngular<
  TContext,
  TStateSchema,
  TEvent extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = { value: any; context: TContext }
> implements OnDestroy {
  private service: Interpreter<TContext, TStateSchema, TEvent, TTypestate>;
  private readonly unsubscribeSubject$ = new ReplaySubject<void>(1);
  readonly unsubscribe$ = this.unsubscribeSubject$.asObservable();

  useMachine(
    machine: StateMachine<TContext, TStateSchema, TEvent, TTypestate>,
    options: Partial<InterpreterOptions> &
      Partial<UseMachineOptions<TContext, TEvent>> &
      Partial<MachineOptions<TContext, TEvent>> = {}
  ): InterpretedService<TContext, TStateSchema, TEvent, TTypestate> {
    const {
      context,
      guards,
      actions,
      activities,
      services,
      delays,
      state: rehydratedState,
      ...interpreterOptions
    } = options;

    const machineConfig = {
      context,
      guards,
      actions,
      activities,
      services,
      delays,
    };

    const createdMachine = machine.withConfig(machineConfig, {
      ...machine.context,
      ...context,
    } as TContext);

    this.service = interpret(createdMachine, interpreterOptions).start(
      rehydratedState ? (State.create(rehydratedState) as any) : undefined
    );

    const state$ = from(this.service).pipe(
      filter(
        ({ changed, event }) =>
          changed ||
          (changed === undefined && !!rehydratedState) ||
          (changed === undefined && !!(event?.type === 'xstate.init'))
      ),
      shareReplay(1),
      takeUntil(this.unsubscribe$)
    );

    return { state$, send: this.service.send, service: this.service };
  }

  ngOnDestroy() {
    this.service.stop();
    this.unsubscribeSubject$.next();
  }
}
