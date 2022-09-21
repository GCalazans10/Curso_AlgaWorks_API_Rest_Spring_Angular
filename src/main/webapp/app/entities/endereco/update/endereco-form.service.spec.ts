import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../endereco.test-samples';

import { EnderecoFormService } from './endereco-form.service';

describe('Endereco Form Service', () => {
  let service: EnderecoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnderecoFormService);
  });

  describe('Service methods', () => {
    describe('createEnderecoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEnderecoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            logradouro: expect.any(Object),
            numero: expect.any(Object),
            complemento: expect.any(Object),
            bairro: expect.any(Object),
            cep: expect.any(Object),
            cidade: expect.any(Object),
            estado: expect.any(Object),
          })
        );
      });

      it('passing IEndereco should create a new form with FormGroup', () => {
        const formGroup = service.createEnderecoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            logradouro: expect.any(Object),
            numero: expect.any(Object),
            complemento: expect.any(Object),
            bairro: expect.any(Object),
            cep: expect.any(Object),
            cidade: expect.any(Object),
            estado: expect.any(Object),
          })
        );
      });
    });

    describe('getEndereco', () => {
      it('should return NewEndereco for default Endereco initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEnderecoFormGroup(sampleWithNewData);

        const endereco = service.getEndereco(formGroup) as any;

        expect(endereco).toMatchObject(sampleWithNewData);
      });

      it('should return NewEndereco for empty Endereco initial value', () => {
        const formGroup = service.createEnderecoFormGroup();

        const endereco = service.getEndereco(formGroup) as any;

        expect(endereco).toMatchObject({});
      });

      it('should return IEndereco', () => {
        const formGroup = service.createEnderecoFormGroup(sampleWithRequiredData);

        const endereco = service.getEndereco(formGroup) as any;

        expect(endereco).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEndereco should not enable id FormControl', () => {
        const formGroup = service.createEnderecoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEndereco should disable id FormControl', () => {
        const formGroup = service.createEnderecoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
