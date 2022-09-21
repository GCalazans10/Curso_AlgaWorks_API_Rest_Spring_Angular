import { IPermicao } from 'app/entities/permicao/permicao.model';

export interface IUsuario {
  id: number;
  nome?: string | null;
  email?: string | null;
  senha?: string | null;
  permicao?: Pick<IPermicao, 'id'> | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
