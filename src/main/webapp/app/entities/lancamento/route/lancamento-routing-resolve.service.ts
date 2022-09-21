import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILancamento } from '../lancamento.model';
import { LancamentoService } from '../service/lancamento.service';

@Injectable({ providedIn: 'root' })
export class LancamentoRoutingResolveService implements Resolve<ILancamento | null> {
  constructor(protected service: LancamentoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILancamento | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lancamento: HttpResponse<ILancamento>) => {
          if (lancamento.body) {
            return of(lancamento.body);
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
