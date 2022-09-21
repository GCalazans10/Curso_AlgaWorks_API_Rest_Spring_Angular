import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PessoaFormService, PessoaFormGroup } from './pessoa-form.service';
import { IPessoa } from '../pessoa.model';
import { PessoaService } from '../service/pessoa.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

@Component({
  selector: 'jhi-pessoa-update',
  templateUrl: './pessoa-update.component.html',
})
export class PessoaUpdateComponent implements OnInit {
  isSaving = false;
  pessoa: IPessoa | null = null;

  enderecosSharedCollection: IEndereco[] = [];

  editForm: PessoaFormGroup = this.pessoaFormService.createPessoaFormGroup();

  constructor(
    protected pessoaService: PessoaService,
    protected pessoaFormService: PessoaFormService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareEndereco = (o1: IEndereco | null, o2: IEndereco | null): boolean => this.enderecoService.compareEndereco(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pessoa }) => {
      this.pessoa = pessoa;
      if (pessoa) {
        this.updateForm(pessoa);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pessoa = this.pessoaFormService.getPessoa(this.editForm);
    if (pessoa.id !== null) {
      this.subscribeToSaveResponse(this.pessoaService.update(pessoa));
    } else {
      this.subscribeToSaveResponse(this.pessoaService.create(pessoa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPessoa>>): void {
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

  protected updateForm(pessoa: IPessoa): void {
    this.pessoa = pessoa;
    this.pessoaFormService.resetForm(this.editForm, pessoa);

    this.enderecosSharedCollection = this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(
      this.enderecosSharedCollection,
      pessoa.endereco
    );
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query()
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) => this.enderecoService.addEnderecoToCollectionIfMissing<IEndereco>(enderecos, this.pessoa?.endereco))
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosSharedCollection = enderecos));
  }
}
