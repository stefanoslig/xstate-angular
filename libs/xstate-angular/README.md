# xstate-angular

[![npm version](https://badge.fury.io/js/xstate-angular.svg)](https://www.npmjs.com/package/xstate-angular)

<img src="https://i.imgur.com/FshbFOv.png" alt="XState" width="150" align="right" />

[XState] is a library for creating, interpreting, and executing finite state machines and statecharts.
This library provides helper functions for using XState in Angular applications

[xstate]: https://github.com/davidkpiano/xstate

## Install

```sh
npm i -S xstate-angular
```

or

```sh
yarn add xstate-angular
```

## How to use

```ts
import { Machine } from 'xstate';
import { InterpretedService, XstateAngular } from 'xstate-angular';
// other imports

const toggleMachine = Machine({
  id: 'toggle',
  initial: 'stateOff',
  states: {
    stateOn: {
      on: { TOGGLE: 'stateOff' },
    },
    stateOff: {
      on: { TOGGLE: 'stateOn' },
    },
  },
});

@Component({
  selector: 'xstate-angular-toggle',
  template: `
    <h3>stateOn: {{ stateOn$ | async }}</h3>
    <h3>stateOff: {{ stateOff$ | async }}</h3>
    <button (click)="toggle()">toggle</button>
  `,
  providers: [XstateAngular],
})
export class ToggleComponent implements OnInit {
  stateOn$: Observable<boolean>;
  stateOff$: Observable<boolean>;
  service: InterpretedService<
    ToggleMachineContext,
    ToggleMachineSchema,
    ToggleMachineEvent
  >;

  constructor(
    private readonly xstateAngular: XstateAngular<
      ToggleMachineContext,
      ToggleMachineSchema,
      ToggleMachineEvent
    >
  ) {
    this.service = this.xstateAngular.useMachine(toggleMachine);
  }

  ngOnInit() {
    this.stateOn$ = this.service.state$.pipe(map((s) => s.matches('stateOn')));
    this.stateOff$ = this.service.state$.pipe(
      map((s) => s.matches('stateOff'))
    );
  }

  toggle() {
    this.service.send({ type: 'TOGGLE' });
  }
}
```

## API

### `XstateAngular.useMachine(machine, options?)`

A function that interprets the given `machine` and starts a service that runs for the lifetime of the component in case you provide the XstateAngular service in the component. If you provide the XstateAngular service in the `root` or in the AppModule, then the service never stops.

**Arguments**

- `machine` - An [XState machine](https://xstate.js.org/docs/guides/machines.html).
- `options` (optional) - [Interpreter options](https://xstate.js.org/docs/guides/interpretation.html#options) OR one of the following Machine Config options: `guards`, `actions`, `activities`, `services`, `delays`, `immediate`, `context`, or `state`.

**Returns** `{ state$, send, service }`:

- `state$` - Represents the current state of the machine as an XState `State` Observable.
- `send` - A function that sends events to the running service.
- `service` - The created service.

### `useService(service)`

A function that subscribes to state changes from an existing service.

**Arguments**

- `service` - An [XState service](https://xstate.js.org/docs/guides/communication.html).

**Returns** `{ state$, send, service }`:

- `state$` - Represents the current state of the service as an XState `State` Observable.
- `send` - A function that sends events to the running service.
- `service` - The existing service.

You can find an example for how you can use the useService helper function and the [Actor model](https://xstate.js.org/docs/guides/actors.html#actor-api) on [this example app](https://github.com/stefanoslig/xstate-angular/tree/main/apps/reddit):

## Configuring Machines

Existing machines can be configured by passing the machine options as the 2nd argument of `XstateAngular.useMachine(machine, options)`.
Example: the `'fetchData'` service and `'notifySuccess'` action are both configurable:

```ts
import { Machine } from 'xstate';
import { InterpretedService, XstateAngular } from 'xstate-angular';
// other imports

const onFetch = () => new Promise((res) => res('some data'));

const fetchMachine = Machine({
  id: 'fetch',
  initial: 'idle',
  context: {
    data: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: { FETCH: 'loading' },
    },
    loading: {
      invoke: {
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_, event) => event.data,
          }),
        },
      },
    },
    success: {
      entry: 'notifySuccess',
      type: 'final',
    },
    failure: {
      on: {
        RETRY: 'loading',
      },
    },
  },
});

@Component({
  selector: 'xstate-angular-fetch',
  template: ``,
  providers: [XstateAngular],
})
export class FetchComponent implements OnInit {
  stateOn$: Observable<boolean>;
  stateOff$: Observable<boolean>;
  service: InterpretedService<
    ToggleMachineContext,
    ToggleMachineSchema,
    ToggleMachineEvent
  >;

  constructor(
    private readonly xstateAngular: XstateAngular<
      ToggleMachineContext,
      ToggleMachineSchema,
      ToggleMachineEvent
    >
  ) {
    this.service = this.xstateAngular.useMachine(fetchMachine, {
      actions: {
        notifySuccess: (ctx) => console.log('resolve', ctx.data),
      },
      services: {
        fetchData: (_, e) =>
          fetch(`some/api/${e.query}`).then((res) => res.json()),
      },
    });
  }
}
```

## Persisted and Rehydrated State

You can persist and rehydrate state with `useMachine(...)` via `options.state`:

```html
<script>
  import { useMachine } from 'xstate-angular';

  // Get the persisted state config object from somewhere, e.g. localStorage
  const persistedState = JSON.parse(
    localStorage.getItem('some-persisted-state-key')
  );

  this.service = this.xstateAngular.useMachine(someMachine, {
    state: persistedState, // provide persisted state config object here
  });

  // state will initially be that persisted state, not the machine's initialState
</script>
```

## Acknowledgments

This module inspired by [`@xstate/vue`](https://github.com/davidkpiano/xstate/tree/master/packages/xstate-vue) and [`xstate-svelte`](https://github.com/distolma/xstate-svelte)
