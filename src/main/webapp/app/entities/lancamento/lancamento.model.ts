import dayjs from 'dayjs/esm';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { TipoLancamento } from 'app/entities/enumerations/tipo-lancamento.model';

export interface ILancamento {
  id: number;
  descricao?: string | null;
  dataVencimento?: dayjs.Dayjs | null;
  dataPagamento?: dayjs.Dayjs | null;
  valor?: number | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  tipo?: TipoLancamento | null;
  pessoa?: Pick<IPessoa, 'id'> | null;
  categoria?: Pick<ICategoria, 'id'> | null;
}

export type NewLancamento = Omit<ILancamento, 'id'> & { id: null };
