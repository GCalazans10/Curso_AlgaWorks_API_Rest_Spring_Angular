import { IEndereco } from 'app/entities/endereco/endereco.model';

export interface IPessoa {
  id: number;
  nome?: string | null;
  ativo?: boolean | null;
  endereco?: Pick<IEndereco, 'id'> | null;
}

export type NewPessoa = Omit<IPessoa, 'id'> & { id: null };
