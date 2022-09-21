import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILancamento } from '../lancamento.model';
import { LancamentoService } from '../service/lancamento.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './lancamento-delete-dialog.component.html',
})
export class LancamentoDeleteDialogComponent {
  lancamento?: ILancamento;

  constructor(protected lancamentoService: LancamentoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lancamentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
