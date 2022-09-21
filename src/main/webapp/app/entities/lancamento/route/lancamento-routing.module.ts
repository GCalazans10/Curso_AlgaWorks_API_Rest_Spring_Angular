import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LancamentoComponent } from '../list/lancamento.component';
import { LancamentoDetailComponent } from '../detail/lancamento-detail.component';
import { LancamentoUpdateComponent } from '../update/lancamento-update.component';
import { LancamentoRoutingResolveService } from './lancamento-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const lancamentoRoute: Routes = [
  {
    path: '',
    component: LancamentoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LancamentoDetailComponent,
    resolve: {
      lancamento: LancamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LancamentoUpdateComponent,
    resolve: {
      lancamento: LancamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LancamentoUpdateComponent,
    resolve: {
      lancamento: LancamentoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lancamentoRoute)],
  exports: [RouterModule],
})
export class LancamentoRoutingModule {}
