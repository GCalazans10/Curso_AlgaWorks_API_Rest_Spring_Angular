import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LancamentoFormService, LancamentoFormGroup } from './lancamento-form.service';
import { ILancamento } from '../lancamento.model';
import { LancamentoService } from '../service/lancamento.service';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';
import { TipoLancamento } from 'app/entities/enumerations/tipo-lancamento.model';

@Component({
  selector: 'jhi-lancamento-update',
  templateUrl: './lancamento-update.component.html',
})
export class LancamentoUpdateComponent implements OnInit {
  isSaving = false;
  lancamento: ILancamento | null = null;
  tipoLancamentoValues = Object.keys(TipoLancamento);

  pessoasSharedCollection: IPessoa[] = [];
  categoriasSharedCollection: ICategoria[] = [];

  editForm: LancamentoFormGroup = this.lancamentoFormService.createLancamentoFormGroup();

  constructor(
    protected lancamentoService: LancamentoService,
    protected lancamentoFormService: LancamentoFormService,
    protected pessoaService: PessoaService,
    protected categoriaService: CategoriaService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePessoa = (o1: IPessoa | null, o2: IPessoa | null): boolean => this.pessoaService.comparePessoa(o1, o2);

  compareCategoria = (o1: ICategoria | null, o2: ICategoria | null): boolean => this.categoriaService.compareCategoria(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lancamento }) => {
      this.lancamento = lancamento;
      if (lancamento) {
        this.updateForm(lancamento);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lancamento = this.lancamentoFormService.getLancamento(this.editForm);
    if (lancamento.id !== null) {
      this.subscribeToSaveResponse(this.lancamentoService.update(lancamento));
    } else {
      this.subscribeToSaveResponse(this.lancamentoService.create(lancamento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILancamento>>): void {
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

  protected updateForm(lancamento: ILancamento): void {
    this.lancamento = lancamento;
    this.lancamentoFormService.resetForm(this.editForm, lancamento);

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(
      this.pessoasSharedCollection,
      lancamento.pessoa
    );
    this.categoriasSharedCollection = this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(
      this.categoriasSharedCollection,
      lancamento.categoria
    );
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing<IPessoa>(pessoas, this.lancamento?.pessoa)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));

    this.categoriaService
      .query()
      .pipe(map((res: HttpResponse<ICategoria[]>) => res.body ?? []))
      .pipe(
        map((categorias: ICategoria[]) =>
          this.categoriaService.addCategoriaToCollectionIfMissing<ICategoria>(categorias, this.lancamento?.categoria)
        )
      )
      .subscribe((categorias: ICategoria[]) => (this.categoriasSharedCollection = categorias));
  }
}
