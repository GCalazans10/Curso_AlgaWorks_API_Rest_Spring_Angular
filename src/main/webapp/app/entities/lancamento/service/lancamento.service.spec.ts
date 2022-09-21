import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ILancamento } from '../lancamento.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../lancamento.test-samples';

import { LancamentoService, RestLancamento } from './lancamento.service';

const requireRestSample: RestLancamento = {
  ...sampleWithRequiredData,
  dataVencimento: sampleWithRequiredData.dataVencimento?.format(DATE_FORMAT),
  dataPagamento: sampleWithRequiredData.dataPagamento?.format(DATE_FORMAT),
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('Lancamento Service', () => {
  let service: LancamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: ILancamento | ILancamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LancamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Lancamento', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const lancamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(lancamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Lancamento', () => {
      const lancamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(lancamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Lancamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Lancamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Lancamento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLancamentoToCollectionIfMissing', () => {
      it('should add a Lancamento to an empty array', () => {
        const lancamento: ILancamento = sampleWithRequiredData;
        expectedResult = service.addLancamentoToCollectionIfMissing([], lancamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lancamento);
      });

      it('should not add a Lancamento to an array that contains it', () => {
        const lancamento: ILancamento = sampleWithRequiredData;
        const lancamentoCollection: ILancamento[] = [
          {
            ...lancamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLancamentoToCollectionIfMissing(lancamentoCollection, lancamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Lancamento to an array that doesn't contain it", () => {
        const lancamento: ILancamento = sampleWithRequiredData;
        const lancamentoCollection: ILancamento[] = [sampleWithPartialData];
        expectedResult = service.addLancamentoToCollectionIfMissing(lancamentoCollection, lancamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lancamento);
      });

      it('should add only unique Lancamento to an array', () => {
        const lancamentoArray: ILancamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const lancamentoCollection: ILancamento[] = [sampleWithRequiredData];
        expectedResult = service.addLancamentoToCollectionIfMissing(lancamentoCollection, ...lancamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lancamento: ILancamento = sampleWithRequiredData;
        const lancamento2: ILancamento = sampleWithPartialData;
        expectedResult = service.addLancamentoToCollectionIfMissing([], lancamento, lancamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lancamento);
        expect(expectedResult).toContain(lancamento2);
      });

      it('should accept null and undefined values', () => {
        const lancamento: ILancamento = sampleWithRequiredData;
        expectedResult = service.addLancamentoToCollectionIfMissing([], null, lancamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lancamento);
      });

      it('should return initial array if no Lancamento is added', () => {
        const lancamentoCollection: ILancamento[] = [sampleWithRequiredData];
        expectedResult = service.addLancamentoToCollectionIfMissing(lancamentoCollection, undefined, null);
        expect(expectedResult).toEqual(lancamentoCollection);
      });
    });

    describe('compareLancamento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLancamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLancamento(entity1, entity2);
        const compareResult2 = service.compareLancamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLancamento(entity1, entity2);
        const compareResult2 = service.compareLancamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLancamento(entity1, entity2);
        const compareResult2 = service.compareLancamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
