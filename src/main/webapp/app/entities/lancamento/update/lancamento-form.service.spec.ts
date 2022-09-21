import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../lancamento.test-samples';

import { LancamentoFormService } from './lancamento-form.service';

describe('Lancamento Form Service', () => {
  let service: LancamentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LancamentoFormService);
  });

  describe('Service methods', () => {
    describe('createLancamentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLancamentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            dataVencimento: expect.any(Object),
            dataPagamento: expect.any(Object),
            valor: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            tipo: expect.any(Object),
            pessoa: expect.any(Object),
            categoria: expect.any(Object),
          })
        );
      });

      it('passing ILancamento should create a new form with FormGroup', () => {
        const formGroup = service.createLancamentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            dataVencimento: expect.any(Object),
            dataPagamento: expect.any(Object),
            valor: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            tipo: expect.any(Object),
            pessoa: expect.any(Object),
            categoria: expect.any(Object),
          })
        );
      });
    });

    describe('getLancamento', () => {
      it('should return NewLancamento for default Lancamento initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLancamentoFormGroup(sampleWithNewData);

        const lancamento = service.getLancamento(formGroup) as any;

        expect(lancamento).toMatchObject(sampleWithNewData);
      });

      it('should return NewLancamento for empty Lancamento initial value', () => {
        const formGroup = service.createLancamentoFormGroup();

        const lancamento = service.getLancamento(formGroup) as any;

        expect(lancamento).toMatchObject({});
      });

      it('should return ILancamento', () => {
        const formGroup = service.createLancamentoFormGroup(sampleWithRequiredData);

        const lancamento = service.getLancamento(formGroup) as any;

        expect(lancamento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILancamento should not enable id FormControl', () => {
        const formGroup = service.createLancamentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLancamento should disable id FormControl', () => {
        const formGroup = service.createLancamentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
