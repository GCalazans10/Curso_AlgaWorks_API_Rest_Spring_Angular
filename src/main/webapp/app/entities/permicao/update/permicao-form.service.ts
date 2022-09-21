import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPermicao, NewPermicao } from '../permicao.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPermicao for edit and NewPermicaoFormGroupInput for create.
 */
type PermicaoFormGroupInput = IPermicao | PartialWithRequiredKeyOf<NewPermicao>;

type PermicaoFormDefaults = Pick<NewPermicao, 'id'>;

type PermicaoFormGroupContent = {
  id: FormControl<IPermicao['id'] | NewPermicao['id']>;
  descricao: FormControl<IPermicao['descricao']>;
};

export type PermicaoFormGroup = FormGroup<PermicaoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PermicaoFormService {
  createPermicaoFormGroup(permicao: PermicaoFormGroupInput = { id: null }): PermicaoFormGroup {
    const permicaoRawValue = {
      ...this.getFormDefaults(),
      ...permicao,
    };
    return new FormGroup<PermicaoFormGroupContent>({
      id: new FormControl(
        { value: permicaoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      descricao: new FormControl(permicaoRawValue.descricao),
    });
  }

  getPermicao(form: PermicaoFormGroup): IPermicao | NewPermicao {
    return form.getRawValue() as IPermicao | NewPermicao;
  }

  resetForm(form: PermicaoFormGroup, permicao: PermicaoFormGroupInput): void {
    const permicaoRawValue = { ...this.getFormDefaults(), ...permicao };
    form.reset(
      {
        ...permicaoRawValue,
        id: { value: permicaoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PermicaoFormDefaults {
    return {
      id: null,
    };
  }
}
