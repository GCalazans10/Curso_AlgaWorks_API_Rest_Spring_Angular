import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICategoria } from '../categoria.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../categoria.test-samples';

import { CategoriaService } from './categoria.service';

const requireRestSample: ICategoria = {
  ...sampleWithRequiredData,
};

describe('Categoria Service', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;
  let expectedResult: ICategoria | ICategoria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CategoriaService);
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

    it('should create a Categoria', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const categoria = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(categoria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Categoria', () => {
      const categoria = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(categoria).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Categoria', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Categoria', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Categoria', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCategoriaToCollectionIfMissing', () => {
      it('should add a Categoria to an empty array', () => {
        const categoria: ICategoria = sampleWithRequiredData;
        expectedResult = service.addCategoriaToCollectionIfMissing([], categoria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categoria);
      });

      it('should not add a Categoria to an array that contains it', () => {
        const categoria: ICategoria = sampleWithRequiredData;
        const categoriaCollection: ICategoria[] = [
          {
            ...categoria,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, categoria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Categoria to an array that doesn't contain it", () => {
        const categoria: ICategoria = sampleWithRequiredData;
        const categoriaCollection: ICategoria[] = [sampleWithPartialData];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, categoria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categoria);
      });

      it('should add only unique Categoria to an array', () => {
        const categoriaArray: ICategoria[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const categoriaCollection: ICategoria[] = [sampleWithRequiredData];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, ...categoriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const categoria: ICategoria = sampleWithRequiredData;
        const categoria2: ICategoria = sampleWithPartialData;
        expectedResult = service.addCategoriaToCollectionIfMissing([], categoria, categoria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categoria);
        expect(expectedResult).toContain(categoria2);
      });

      it('should accept null and undefined values', () => {
        const categoria: ICategoria = sampleWithRequiredData;
        expectedResult = service.addCategoriaToCollectionIfMissing([], null, categoria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categoria);
      });

      it('should return initial array if no Categoria is added', () => {
        const categoriaCollection: ICategoria[] = [sampleWithRequiredData];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, undefined, null);
        expect(expectedResult).toEqual(categoriaCollection);
      });
    });

    describe('compareCategoria', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCategoria(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCategoria(entity1, entity2);
        const compareResult2 = service.compareCategoria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCategoria(entity1, entity2);
        const compareResult2 = service.compareCategoria(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCategoria(entity1, entity2);
        const compareResult2 = service.compareCategoria(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
