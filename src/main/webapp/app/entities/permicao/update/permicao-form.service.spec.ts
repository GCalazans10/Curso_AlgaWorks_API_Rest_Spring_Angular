import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../permicao.test-samples';

import { PermicaoFormService } from './permicao-form.service';

describe('Permicao Form Service', () => {
  let service: PermicaoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermicaoFormService);
  });

  describe('Service methods', () => {
    describe('createPermicaoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPermicaoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
          })
        );
      });

      it('passing IPermicao should create a new form with FormGroup', () => {
        const formGroup = service.createPermicaoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
          })
        );
      });
    });

    describe('getPermicao', () => {
      it('should return NewPermicao for default Permicao initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPermicaoFormGroup(sampleWithNewData);

        const permicao = service.getPermicao(formGroup) as any;

        expect(permicao).toMatchObject(sampleWithNewData);
      });

      it('should return NewPermicao for empty Permicao initial value', () => {
        const formGroup = service.createPermicaoFormGroup();

        const permicao = service.getPermicao(formGroup) as any;

        expect(permicao).toMatchObject({});
      });

      it('should return IPermicao', () => {
        const formGroup = service.createPermicaoFormGroup(sampleWithRequiredData);

        const permicao = service.getPermicao(formGroup) as any;

        expect(permicao).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPermicao should not enable id FormControl', () => {
        const formGroup = service.createPermicaoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPermicao should disable id FormControl', () => {
        const formGroup = service.createPermicaoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
