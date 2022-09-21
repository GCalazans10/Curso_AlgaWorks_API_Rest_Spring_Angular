import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PermicaoComponent } from '../list/permicao.component';
import { PermicaoDetailComponent } from '../detail/permicao-detail.component';
import { PermicaoUpdateComponent } from '../update/permicao-update.component';
import { PermicaoRoutingResolveService } from './permicao-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const permicaoRoute: Routes = [
  {
    path: '',
    component: PermicaoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PermicaoDetailComponent,
    resolve: {
      permicao: PermicaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PermicaoUpdateComponent,
    resolve: {
      permicao: PermicaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PermicaoUpdateComponent,
    resolve: {
      permicao: PermicaoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(permicaoRoute)],
  exports: [RouterModule],
})
export class PermicaoRoutingModule {}
