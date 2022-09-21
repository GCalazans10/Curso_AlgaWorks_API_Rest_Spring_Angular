import dayjs from 'dayjs/esm';

import { TipoLancamento } from 'app/entities/enumerations/tipo-lancamento.model';

import { ILancamento, NewLancamento } from './lancamento.model';

export const sampleWithRequiredData: ILancamento = {
  id: 79177,
};

export const sampleWithPartialData: ILancamento = {
  id: 21339,
  dataVencimento: dayjs('2022-09-21'),
  dataPagamento: dayjs('2022-09-20'),
  valor: 68835,
  endDate: dayjs('2022-09-20T18:17'),
  tipo: TipoLancamento['DESPESA'],
};

export const sampleWithFullData: ILancamento = {
  id: 94077,
  descricao: 'invoice interactive',
  dataVencimento: dayjs('2022-09-20'),
  dataPagamento: dayjs('2022-09-20'),
  valor: 21103,
  startDate: dayjs('2022-09-20T21:38'),
  endDate: dayjs('2022-09-21T02:40'),
  tipo: TipoLancamento['RECEITA'],
};

export const sampleWithNewData: NewLancamento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
