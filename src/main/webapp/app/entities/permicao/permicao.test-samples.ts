import { IPermicao, NewPermicao } from './permicao.model';

export const sampleWithRequiredData: IPermicao = {
  id: 57126,
};

export const sampleWithPartialData: IPermicao = {
  id: 13547,
};

export const sampleWithFullData: IPermicao = {
  id: 36516,
  descricao: 'Mouse',
};

export const sampleWithNewData: NewPermicao = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
