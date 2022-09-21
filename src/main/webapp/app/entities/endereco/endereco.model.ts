export interface IEndereco {
  id: number;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

export type NewEndereco = Omit<IEndereco, 'id'> & { id: null };
