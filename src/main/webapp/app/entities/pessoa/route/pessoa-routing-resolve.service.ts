import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPessoa } from '../pessoa.model';
import { PessoaService } from '../service/pessoa.service';

@Injectable({ providedIn: 'root' })
export class PessoaRoutingResolveService implements Resolve<IPessoa | null> {
  constructor(protected service: PessoaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPessoa | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((pessoa: HttpResponse<IPessoa>) => {
          if (pessoa.body) {
            return of(pessoa.body);
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
