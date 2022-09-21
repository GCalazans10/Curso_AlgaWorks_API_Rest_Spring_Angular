import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PermicaoComponent } from './list/permicao.component';
import { PermicaoDetailComponent } from './detail/permicao-detail.component';
import { PermicaoUpdateComponent } from './update/permicao-update.component';
import { PermicaoDeleteDialogComponent } from './delete/permicao-delete-dialog.component';
import { PermicaoRoutingModule } from './route/permicao-routing.module';

@NgModule({
  imports: [SharedModule, PermicaoRoutingModule],
  declarations: [PermicaoComponent, PermicaoDetailComponent, PermicaoUpdateComponent, PermicaoDeleteDialogComponent],
})
export class PermicaoModule {}
