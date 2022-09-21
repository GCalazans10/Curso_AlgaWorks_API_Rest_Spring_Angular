import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUsuario } from '../usuario.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../usuario.test-samples';

import { UsuarioService } from './usuario.service';

const requireRestSample: IUsuario = {
  ...sampleWithRequiredData,
};

describe('Usuario Service', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  let expectedResult: IUsuario | IUsuario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UsuarioService);
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

    it('should create a Usuario', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const usuario = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(usuario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Usuario', () => {
      const usuario = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(usuario).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Usuario', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Usuario', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Usuario', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUsuarioToCollectionIfMissing', () => {
      it('should add a Usuario to an empty array', () => {
        const usuario: IUsuario = sampleWithRequiredData;
        expectedResult = service.addUsuarioToCollectionIfMissing([], usuario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(usuario);
      });

      it('should not add a Usuario to an array that contains it', () => {
        const usuario: IUsuario = sampleWithRequiredData;
        const usuarioCollection: IUsuario[] = [
          {
            ...usuario,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUsuarioToCollectionIfMissing(usuarioCollection, usuario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Usuario to an array that doesn't contain it", () => {
        const usuario: IUsuario = sampleWithRequiredData;
        const usuarioCollection: IUsuario[] = [sampleWithPartialData];
        expectedResult = service.addUsuarioToCollectionIfMissing(usuarioCollection, usuario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(usuario);
      });

      it('should add only unique Usuario to an array', () => {
        const usuarioArray: IUsuario[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const usuarioCollection: IUsuario[] = [sampleWithRequiredData];
        expectedResult = service.addUsuarioToCollectionIfMissing(usuarioCollection, ...usuarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const usuario: IUsuario = sampleWithRequiredData;
        const usuario2: IUsuario = sampleWithPartialData;
        expectedResult = service.addUsuarioToCollectionIfMissing([], usuario, usuario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(usuario);
        expect(expectedResult).toContain(usuario2);
      });

      it('should accept null and undefined values', () => {
        const usuario: IUsuario = sampleWithRequiredData;
        expectedResult = service.addUsuarioToCollectionIfMissing([], null, usuario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(usuario);
      });

      it('should return initial array if no Usuario is added', () => {
        const usuarioCollection: IUsuario[] = [sampleWithRequiredData];
        expectedResult = service.addUsuarioToCollectionIfMissing(usuarioCollection, undefined, null);
        expect(expectedResult).toEqual(usuarioCollection);
      });
    });

    describe('compareUsuario', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUsuario(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUsuario(entity1, entity2);
        const compareResult2 = service.compareUsuario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUsuario(entity1, entity2);
        const compareResult2 = service.compareUsuario(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUsuario(entity1, entity2);
        const compareResult2 = service.compareUsuario(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
