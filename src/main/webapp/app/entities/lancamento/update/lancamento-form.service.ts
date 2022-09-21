import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILancamento, NewLancamento } from '../lancamento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILancamento for edit and NewLancamentoFormGroupInput for create.
 */
type LancamentoFormGroupInput = ILancamento | PartialWithRequiredKeyOf<NewLancamento>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ILancamento | NewLancamento> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type LancamentoFormRawValue = FormValueOf<ILancamento>;

type NewLancamentoFormRawValue = FormValueOf<NewLancamento>;

type LancamentoFormDefaults = Pick<NewLancamento, 'id' | 'startDate' | 'endDate'>;

type LancamentoFormGroupContent = {
  id: FormControl<LancamentoFormRawValue['id'] | NewLancamento['id']>;
  descricao: FormControl<LancamentoFormRawValue['descricao']>;
  dataVencimento: FormControl<LancamentoFormRawValue['dataVencimento']>;
  dataPagamento: FormControl<LancamentoFormRawValue['dataPagamento']>;
  valor: FormControl<LancamentoFormRawValue['valor']>;
  startDate: FormControl<LancamentoFormRawValue['startDate']>;
  endDate: FormControl<LancamentoFormRawValue['endDate']>;
  tipo: FormControl<LancamentoFormRawValue['tipo']>;
  pessoa: FormControl<LancamentoFormRawValue['pessoa']>;
  categoria: FormControl<LancamentoFormRawValue['categoria']>;
};

export type LancamentoFormGroup = FormGroup<LancamentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LancamentoFormService {
  createLancamentoFormGroup(lancamento: LancamentoFormGroupInput = { id: null }): LancamentoFormGroup {
    const lancamentoRawValue = this.convertLancamentoToLancamentoRawValue({
      ...this.getFormDefaults(),
      ...lancamento,
    });
    return new FormGroup<LancamentoFormGroupContent>({
      id: new FormControl(
        { value: lancamentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      descricao: new FormControl(lancamentoRawValue.descricao),
      dataVencimento: new FormControl(lancamentoRawValue.dataVencimento),
      dataPagamento: new FormControl(lancamentoRawValue.dataPagamento),
      valor: new FormControl(lancamentoRawValue.valor),
      startDate: new FormControl(lancamentoRawValue.startDate),
      endDate: new FormControl(lancamentoRawValue.endDate),
      tipo: new FormControl(lancamentoRawValue.tipo),
      pessoa: new FormControl(lancamentoRawValue.pessoa),
      categoria: new FormControl(lancamentoRawValue.categoria),
    });
  }

  getLancamento(form: LancamentoFormGroup): ILancamento | NewLancamento {
    return this.convertLancamentoRawValueToLancamento(form.getRawValue() as LancamentoFormRawValue | NewLancamentoFormRawValue);
  }

  resetForm(form: LancamentoFormGroup, lancamento: LancamentoFormGroupInput): void {
    const lancamentoRawValue = this.convertLancamentoToLancamentoRawValue({ ...this.getFormDefaults(), ...lancamento });
    form.reset(
      {
        ...lancamentoRawValue,
        id: { value: lancamentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LancamentoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertLancamentoRawValueToLancamento(
    rawLancamento: LancamentoFormRawValue | NewLancamentoFormRawValue
  ): ILancamento | NewLancamento {
    return {
      ...rawLancamento,
      startDate: dayjs(rawLancamento.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawLancamento.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertLancamentoToLancamentoRawValue(
    lancamento: ILancamento | (Partial<NewLancamento> & LancamentoFormDefaults)
  ): LancamentoFormRawValue | PartialWithRequiredKeyOf<NewLancamentoFormRawValue> {
    return {
      ...lancamento,
      startDate: lancamento.startDate ? lancamento.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: lancamento.endDate ? lancamento.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
