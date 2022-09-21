import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPermicao } from '../permicao.model';
import { PermicaoService } from '../service/permicao.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './permicao-delete-dialog.component.html',
})
export class PermicaoDeleteDialogComponent {
  permicao?: IPermicao;

  constructor(protected permicaoService: PermicaoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.permicaoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
