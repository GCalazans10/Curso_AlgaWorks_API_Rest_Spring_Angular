import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPermicao } from '../permicao.model';
import { PermicaoService } from '../service/permicao.service';

@Injectable({ providedIn: 'root' })
export class PermicaoRoutingResolveService implements Resolve<IPermicao | null> {
  constructor(protected service: PermicaoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPermicao | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((permicao: HttpResponse<IPermicao>) => {
          if (permicao.body) {
            return of(permicao.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
