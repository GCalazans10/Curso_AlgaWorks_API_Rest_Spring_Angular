import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../categoria.test-samples';

import { CategoriaFormService } from './categoria-form.service';

describe('Categoria Form Service', () => {
  let service: CategoriaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaFormService);
  });

  describe('Service methods', () => {
    describe('createCategoriaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCategoriaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          })
        );
      });

      it('passing ICategoria should create a new form with FormGroup', () => {
        const formGroup = service.createCategoriaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          })
        );
      });
    });

    describe('getCategoria', () => {
      it('should return NewCategoria for default Categoria initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCategoriaFormGroup(sampleWithNewData);

        const categoria = service.getCategoria(formGroup) as any;

        expect(categoria).toMatchObject(sampleWithNewData);
      });

      it('should return NewCategoria for empty Categoria initial value', () => {
        const formGroup = service.createCategoriaFormGroup();

        const categoria = service.getCategoria(formGroup) as any;

        expect(categoria).toMatchObject({});
      });

      it('should return ICategoria', () => {
        const formGroup = service.createCategoriaFormGroup(sampleWithRequiredData);

        const categoria = service.getCategoria(formGroup) as any;

        expect(categoria).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICategoria should not enable id FormControl', () => {
        const formGroup = service.createCategoriaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCategoria should disable id FormControl', () => {
        const formGroup = service.createCategoriaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
