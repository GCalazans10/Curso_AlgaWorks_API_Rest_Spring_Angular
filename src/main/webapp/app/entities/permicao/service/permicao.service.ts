import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPermicao, NewPermicao } from '../permicao.model';

export type PartialUpdatePermicao = Partial<IPermicao> & Pick<IPermicao, 'id'>;

export type EntityResponseType = HttpResponse<IPermicao>;
export type EntityArrayResponseType = HttpResponse<IPermicao[]>;

@Injectable({ providedIn: 'root' })
export class PermicaoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/permicaos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(permicao: NewPermicao): Observable<EntityResponseType> {
    return this.http.post<IPermicao>(this.resourceUrl, permicao, { observe: 'response' });
  }

  update(permicao: IPermicao): Observable<EntityResponseType> {
    return this.http.put<IPermicao>(`${this.resourceUrl}/${this.getPermicaoIdentifier(permicao)}`, permicao, { observe: 'response' });
  }

  partialUpdate(permicao: PartialUpdatePermicao): Observable<EntityResponseType> {
    return this.http.patch<IPermicao>(`${this.resourceUrl}/${this.getPermicaoIdentifier(permicao)}`, permicao, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPermicao>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPermicao[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPermicaoIdentifier(permicao: Pick<IPermicao, 'id'>): number {
    return permicao.id;
  }

  comparePermicao(o1: Pick<IPermicao, 'id'> | null, o2: Pick<IPermicao, 'id'> | null): boolean {
    return o1 && o2 ? this.getPermicaoIdentifier(o1) === this.getPermicaoIdentifier(o2) : o1 === o2;
  }

  addPermicaoToCollectionIfMissing<Type extends Pick<IPermicao, 'id'>>(
    permicaoCollection: Type[],
    ...permicaosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const permicaos: Type[] = permicaosToCheck.filter(isPresent);
    if (permicaos.length > 0) {
      const permicaoCollectionIdentifiers = permicaoCollection.map(permicaoItem => this.getPermicaoIdentifier(permicaoItem)!);
      const permicaosToAdd = permicaos.filter(permicaoItem => {
        const permicaoIdentifier = this.getPermicaoIdentifier(permicaoItem);
        if (permicaoCollectionIdentifiers.includes(permicaoIdentifier)) {
          return false;
        }
        permicaoCollectionIdentifiers.push(permicaoIdentifier);
        return true;
      });
      return [...permicaosToAdd, ...permicaoCollection];
    }
    return permicaoCollection;
  }
}
