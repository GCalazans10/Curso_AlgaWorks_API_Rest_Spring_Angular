import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILancamento } from '../lancamento.model';

@Component({
  selector: 'jhi-lancamento-detail',
  templateUrl: './lancamento-detail.component.html',
})
export class LancamentoDetailComponent implements OnInit {
  lancamento: ILancamento | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lancamento }) => {
      this.lancamento = lancamento;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
