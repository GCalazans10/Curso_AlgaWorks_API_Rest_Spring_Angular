import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: 82183,
  nome: 'Streets',
};

export const sampleWithPartialData: IPessoa = {
  id: 91510,
  nome: 'Licensed hub Business-focused',
};

export const sampleWithFullData: IPessoa = {
  id: 43753,
  nome: 'Tunnel Automotive',
  ativo: false,
};

export const sampleWithNewData: NewPessoa = {
  nome: 'directional reinvent Applications',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
