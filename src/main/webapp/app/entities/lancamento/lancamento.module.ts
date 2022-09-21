import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LancamentoComponent } from './list/lancamento.component';
import { LancamentoDetailComponent } from './detail/lancamento-detail.component';
import { LancamentoUpdateComponent } from './update/lancamento-update.component';
import { LancamentoDeleteDialogComponent } from './delete/lancamento-delete-dialog.component';
import { LancamentoRoutingModule } from './route/lancamento-routing.module';

@NgModule({
  imports: [SharedModule, LancamentoRoutingModule],
  declarations: [LancamentoComponent, LancamentoDetailComponent, LancamentoUpdateComponent, LancamentoDeleteDialogComponent],
})
export class LancamentoModule {}
