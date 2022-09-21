import { IEndereco, NewEndereco } from './endereco.model';

export const sampleWithRequiredData: IEndereco = {
  id: 91029,
};

export const sampleWithPartialData: IEndereco = {
  id: 1151,
  logradouro: 'edge connect Table',
  numero: 'CFP Money',
  complemento: 'transmitting parsing',
  cep: 'Practical South',
  cidade: 'Innovative Malawi',
  estado: 'dynamic Shilling',
};

export const sampleWithFullData: IEndereco = {
  id: 86724,
  logradouro: 'Solutions',
  numero: 'Frozen Checking',
  complemento: 'bluetooth Home 1080p',
  bairro: 'scale Automated',
  cep: 'Direct e-markets',
  cidade: 'JBOD XML SMTP',
  estado: 'Buckinghamshire multi-byte',
};

export const sampleWithNewData: NewEndereco = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
