import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class FragmentService {
  constructor(private route: ActivatedRoute) {
  }

  getFragment(): any {
    const fragmentPartPairs = {} as any;

    const fragment = this.route.snapshot.fragment;
    if (!fragment) {
      return fragmentPartPairs;
    }

    const fragmentParts = fragment.split('&');
    fragmentParts.forEach(x => {
      if (!x) {
        return;
      }

      const separatorIndex = x.indexOf('=');
      if (!separatorIndex) {
        return;
      }

      const key = x.substring(0, separatorIndex);
      const value = x.substring(separatorIndex + 1);
      fragmentPartPairs[key] = value;
    });

    return fragmentPartPairs;
  }
}
