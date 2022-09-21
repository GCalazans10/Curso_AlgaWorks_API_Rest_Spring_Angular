import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 19585,
};

export const sampleWithPartialData: IUsuario = {
  id: 41066,
  senha: 'knowledge Accounts Berkshire',
};

export const sampleWithFullData: IUsuario = {
  id: 20371,
  nome: 'synthesizing Corners Cambridgeshire',
  email: 'Elise88@yahoo.com',
  senha: 'Plastic synthesizing',
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
