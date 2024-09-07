import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

export class State {
  private static readonly APPLICATION_ID_KEY = 'applicationId';
  private static readonly RETURN_URL_KEY = 'returnUrl';

  applicationId?: string;
  returnUrl?: string;

  static fromParams(params: Params): State {
    const applicationId = params[State.APPLICATION_ID_KEY];
    const returnUrl = params[State.RETURN_URL_KEY];

    const state = {
      applicationId,
      returnUrl
    } as State;

    return state;
  }

  static toString(state: State): string {
    const stateString = new HttpParams({ fromObject: state as any }).toString();
    return encodeURI(stateString);
  }
}
