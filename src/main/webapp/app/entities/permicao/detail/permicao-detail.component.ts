import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPermicao } from '../permicao.model';

@Component({
  selector: 'jhi-permicao-detail',
  templateUrl: './permicao-detail.component.html',
})
export class PermicaoDetailComponent implements OnInit {
  permicao: IPermicao | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permicao }) => {
      this.permicao = permicao;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
