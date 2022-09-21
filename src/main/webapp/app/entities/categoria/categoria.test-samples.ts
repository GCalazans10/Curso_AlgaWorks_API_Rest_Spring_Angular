import { ICategoria, NewCategoria } from './categoria.model';

export const sampleWithRequiredData: ICategoria = {
  id: 34642,
};

export const sampleWithPartialData: ICategoria = {
  id: 63725,
};

export const sampleWithFullData: ICategoria = {
  id: 3257,
  nome: 'Wooden Tactics',
};

export const sampleWithNewData: NewCategoria = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
