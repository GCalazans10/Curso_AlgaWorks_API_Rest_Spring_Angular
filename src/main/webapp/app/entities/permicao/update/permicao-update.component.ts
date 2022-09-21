import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PermicaoFormService, PermicaoFormGroup } from './permicao-form.service';
import { IPermicao } from '../permicao.model';
import { PermicaoService } from '../service/permicao.service';

@Component({
  selector: 'jhi-permicao-update',
  templateUrl: './permicao-update.component.html',
})
export class PermicaoUpdateComponent implements OnInit {
  isSaving = false;
  permicao: IPermicao | null = null;

  editForm: PermicaoFormGroup = this.permicaoFormService.createPermicaoFormGroup();

  constructor(
    protected permicaoService: PermicaoService,
    protected permicaoFormService: PermicaoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ permicao }) => {
      this.permicao = permicao;
      if (permicao) {
        this.updateForm(permicao);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const permicao = this.permicaoFormService.getPermicao(this.editForm);
    if (permicao.id !== null) {
      this.subscribeToSaveResponse(this.permicaoService.update(permicao));
    } else {
      this.subscribeToSaveResponse(this.permicaoService.create(permicao));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPermicao>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(permicao: IPermicao): void {
    this.permicao = permicao;
    this.permicaoFormService.resetForm(this.editForm, permicao);
  }
}
