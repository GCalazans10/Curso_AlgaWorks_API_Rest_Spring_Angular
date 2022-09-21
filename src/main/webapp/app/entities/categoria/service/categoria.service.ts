import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategoria, NewCategoria } from '../categoria.model';

export type PartialUpdateCategoria = Partial<ICategoria> & Pick<ICategoria, 'id'>;

export type EntityResponseType = HttpResponse<ICategoria>;
export type EntityArrayResponseType = HttpResponse<ICategoria[]>;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(categoria: NewCategoria): Observable<EntityResponseType> {
    return this.http.post<ICategoria>(this.resourceUrl, categoria, { observe: 'response' });
  }

  update(categoria: ICategoria): Observable<EntityResponseType> {
    return this.http.put<ICategoria>(`${this.resourceUrl}/${this.getCategoriaIdentifier(categoria)}`, categoria, { observe: 'response' });
  }

  partialUpdate(categoria: PartialUpdateCategoria): Observable<EntityResponseType> {
    return this.http.patch<ICategoria>(`${this.resourceUrl}/${this.getCategoriaIdentifier(categoria)}`, categoria, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategoria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCategoriaIdentifier(categoria: Pick<ICategoria, 'id'>): number {
    return categoria.id;
  }

  compareCategoria(o1: Pick<ICategoria, 'id'> | null, o2: Pick<ICategoria, 'id'> | null): boolean {
    return o1 && o2 ? this.getCategoriaIdentifier(o1) === this.getCategoriaIdentifier(o2) : o1 === o2;
  }

  addCategoriaToCollectionIfMissing<Type extends Pick<ICategoria, 'id'>>(
    categoriaCollection: Type[],
    ...categoriasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const categorias: Type[] = categoriasToCheck.filter(isPresent);
    if (categorias.length > 0) {
      const categoriaCollectionIdentifiers = categoriaCollection.map(categoriaItem => this.getCategoriaIdentifier(categoriaItem)!);
      const categoriasToAdd = categorias.filter(categoriaItem => {
        const categoriaIdentifier = this.getCategoriaIdentifier(categoriaItem);
        if (categoriaCollectionIdentifiers.includes(categoriaIdentifier)) {
          return false;
        }
        categoriaCollectionIdentifiers.push(categoriaIdentifier);
        return true;
      });
      return [...categoriasToAdd, ...categoriaCollection];
    }
    return categoriaCollection;
  }
}
