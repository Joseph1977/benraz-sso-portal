import { Injectable } from '@angular/core';
import { State } from './state.model';

@Injectable()
export class StateService {

  private static readonly STATE_KEY = 'state';

  getState(): State {
    const stateString = localStorage.getItem(StateService.STATE_KEY);
    if (!stateString) {
      return {};
    }

    return JSON.parse(stateString);
  }

  saveState(state: State): void {
    localStorage.setItem(StateService.STATE_KEY, JSON.stringify(state));
  }

  discardState() {
    localStorage.removeItem(StateService.STATE_KEY);
  }
}
