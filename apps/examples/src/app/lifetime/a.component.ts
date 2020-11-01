import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Machine } from 'xstate';
import { InterpretedService, XstateAngular } from 'xstate-angular';

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
  selector: 'xstate-angular-a',
  template: `
    <h3>stateOn: {{ stateOn$ | async }}</h3>
    <h3>stateOff: {{ stateOff$ | async }}</h3>
    <button (click)="toggle()">toggle</button>
  `,
  providers: [XstateAngular],
})
export class AComponent implements OnDestroy, OnInit {
  stateOn$: Observable<boolean>;
  stateOff$: Observable<boolean>;
  service: InterpretedService<any, any, any>;
  constructor(private readonly xstateAngular: XstateAngular<any, any, any>) {}

  ngOnInit() {
    this.service = this.xstateAngular.useMachine(toggleMachine);
    this.stateOn$ = this.service.state$.pipe(map((s) => s.matches('stateOn')));
    this.stateOff$ = this.service.state$.pipe(
      map((s) => s.matches('stateOff'))
    );
  }

  toggle() {
    this.service.send({ type: 'TOGGLE' });
  }
  ngOnDestroy() {
    console.log('destroyed + state machine automatically stopped');
  }
}
