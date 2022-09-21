import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPermicao } from '../permicao.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../permicao.test-samples';

import { PermicaoService } from './permicao.service';

const requireRestSample: IPermicao = {
  ...sampleWithRequiredData,
};

describe('Permicao Service', () => {
  let service: PermicaoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPermicao | IPermicao[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PermicaoService);
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

    it('should create a Permicao', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const permicao = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(permicao).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Permicao', () => {
      const permicao = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(permicao).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Permicao', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Permicao', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Permicao', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPermicaoToCollectionIfMissing', () => {
      it('should add a Permicao to an empty array', () => {
        const permicao: IPermicao = sampleWithRequiredData;
        expectedResult = service.addPermicaoToCollectionIfMissing([], permicao);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(permicao);
      });

      it('should not add a Permicao to an array that contains it', () => {
        const permicao: IPermicao = sampleWithRequiredData;
        const permicaoCollection: IPermicao[] = [
          {
            ...permicao,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPermicaoToCollectionIfMissing(permicaoCollection, permicao);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Permicao to an array that doesn't contain it", () => {
        const permicao: IPermicao = sampleWithRequiredData;
        const permicaoCollection: IPermicao[] = [sampleWithPartialData];
        expectedResult = service.addPermicaoToCollectionIfMissing(permicaoCollection, permicao);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(permicao);
      });

      it('should add only unique Permicao to an array', () => {
        const permicaoArray: IPermicao[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const permicaoCollection: IPermicao[] = [sampleWithRequiredData];
        expectedResult = service.addPermicaoToCollectionIfMissing(permicaoCollection, ...permicaoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const permicao: IPermicao = sampleWithRequiredData;
        const permicao2: IPermicao = sampleWithPartialData;
        expectedResult = service.addPermicaoToCollectionIfMissing([], permicao, permicao2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(permicao);
        expect(expectedResult).toContain(permicao2);
      });

      it('should accept null and undefined values', () => {
        const permicao: IPermicao = sampleWithRequiredData;
        expectedResult = service.addPermicaoToCollectionIfMissing([], null, permicao, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(permicao);
      });

      it('should return initial array if no Permicao is added', () => {
        const permicaoCollection: IPermicao[] = [sampleWithRequiredData];
        expectedResult = service.addPermicaoToCollectionIfMissing(permicaoCollection, undefined, null);
        expect(expectedResult).toEqual(permicaoCollection);
      });
    });

    describe('comparePermicao', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePermicao(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePermicao(entity1, entity2);
        const compareResult2 = service.comparePermicao(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePermicao(entity1, entity2);
        const compareResult2 = service.comparePermicao(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePermicao(entity1, entity2);
        const compareResult2 = service.comparePermicao(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
