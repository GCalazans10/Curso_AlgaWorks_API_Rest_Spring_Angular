export interface IPermicao {
  id: number;
  descricao?: string | null;
}

export type NewPermicao = Omit<IPermicao, 'id'> & { id: null };
