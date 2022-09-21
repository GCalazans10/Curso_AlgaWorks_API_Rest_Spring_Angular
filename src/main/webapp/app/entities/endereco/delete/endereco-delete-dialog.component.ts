import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEndereco } from '../endereco.model';
import { EnderecoService } from '../service/endereco.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './endereco-delete-dialog.component.html',
})
export class EnderecoDeleteDialogComponent {
  endereco?: IEndereco;

  constructor(protected enderecoService: EnderecoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.enderecoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
