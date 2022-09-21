import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UsuarioFormService, UsuarioFormGroup } from './usuario-form.service';
import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { IPermicao } from 'app/entities/permicao/permicao.model';
import { PermicaoService } from 'app/entities/permicao/service/permicao.service';

@Component({
  selector: 'jhi-usuario-update',
  templateUrl: './usuario-update.component.html',
})
export class UsuarioUpdateComponent implements OnInit {
  isSaving = false;
  usuario: IUsuario | null = null;

  permicaosSharedCollection: IPermicao[] = [];

  editForm: UsuarioFormGroup = this.usuarioFormService.createUsuarioFormGroup();

  constructor(
    protected usuarioService: UsuarioService,
    protected usuarioFormService: UsuarioFormService,
    protected permicaoService: PermicaoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePermicao = (o1: IPermicao | null, o2: IPermicao | null): boolean => this.permicaoService.comparePermicao(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
      if (usuario) {
        this.updateForm(usuario);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuario = this.usuarioFormService.getUsuario(this.editForm);
    if (usuario.id !== null) {
      this.subscribeToSaveResponse(this.usuarioService.update(usuario));
    } else {
      this.subscribeToSaveResponse(this.usuarioService.create(usuario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuario>>): void {
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

  protected updateForm(usuario: IUsuario): void {
    this.usuario = usuario;
    this.usuarioFormService.resetForm(this.editForm, usuario);

    this.permicaosSharedCollection = this.permicaoService.addPermicaoToCollectionIfMissing<IPermicao>(
      this.permicaosSharedCollection,
      usuario.permicao
    );
  }

  protected loadRelationshipsOptions(): void {
    this.permicaoService
      .query()
      .pipe(map((res: HttpResponse<IPermicao[]>) => res.body ?? []))
      .pipe(
        map((permicaos: IPermicao[]) => this.permicaoService.addPermicaoToCollectionIfMissing<IPermicao>(permicaos, this.usuario?.permicao))
      )
      .subscribe((permicaos: IPermicao[]) => (this.permicaosSharedCollection = permicaos));
  }
}
