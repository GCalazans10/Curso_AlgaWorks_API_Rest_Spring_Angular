import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEndereco } from '../endereco.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../endereco.test-samples';

import { EnderecoService } from './endereco.service';

const requireRestSample: IEndereco = {
  ...sampleWithRequiredData,
};

describe('Endereco Service', () => {
  let service: EnderecoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEndereco | IEndereco[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EnderecoService);
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

    it('should create a Endereco', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const endereco = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(endereco).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Endereco', () => {
      const endereco = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(endereco).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Endereco', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Endereco', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Endereco', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEnderecoToCollectionIfMissing', () => {
      it('should add a Endereco to an empty array', () => {
        const endereco: IEndereco = sampleWithRequiredData;
        expectedResult = service.addEnderecoToCollectionIfMissing([], endereco);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(endereco);
      });

      it('should not add a Endereco to an array that contains it', () => {
        const endereco: IEndereco = sampleWithRequiredData;
        const enderecoCollection: IEndereco[] = [
          {
            ...endereco,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnderecoToCollectionIfMissing(enderecoCollection, endereco);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Endereco to an array that doesn't contain it", () => {
        const endereco: IEndereco = sampleWithRequiredData;
        const enderecoCollection: IEndereco[] = [sampleWithPartialData];
        expectedResult = service.addEnderecoToCollectionIfMissing(enderecoCollection, endereco);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(endereco);
      });

      it('should add only unique Endereco to an array', () => {
        const enderecoArray: IEndereco[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const enderecoCollection: IEndereco[] = [sampleWithRequiredData];
        expectedResult = service.addEnderecoToCollectionIfMissing(enderecoCollection, ...enderecoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const endereco: IEndereco = sampleWithRequiredData;
        const endereco2: IEndereco = sampleWithPartialData;
        expectedResult = service.addEnderecoToCollectionIfMissing([], endereco, endereco2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(endereco);
        expect(expectedResult).toContain(endereco2);
      });

      it('should accept null and undefined values', () => {
        const endereco: IEndereco = sampleWithRequiredData;
        expectedResult = service.addEnderecoToCollectionIfMissing([], null, endereco, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(endereco);
      });

      it('should return initial array if no Endereco is added', () => {
        const enderecoCollection: IEndereco[] = [sampleWithRequiredData];
        expectedResult = service.addEnderecoToCollectionIfMissing(enderecoCollection, undefined, null);
        expect(expectedResult).toEqual(enderecoCollection);
      });
    });

    describe('compareEndereco', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEndereco(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEndereco(entity1, entity2);
        const compareResult2 = service.compareEndereco(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEndereco(entity1, entity2);
        const compareResult2 = service.compareEndereco(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEndereco(entity1, entity2);
        const compareResult2 = service.compareEndereco(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
