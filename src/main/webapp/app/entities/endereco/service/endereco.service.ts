import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEndereco, NewEndereco } from '../endereco.model';

export type PartialUpdateEndereco = Partial<IEndereco> & Pick<IEndereco, 'id'>;

export type EntityResponseType = HttpResponse<IEndereco>;
export type EntityArrayResponseType = HttpResponse<IEndereco[]>;

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/enderecos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(endereco: NewEndereco): Observable<EntityResponseType> {
    return this.http.post<IEndereco>(this.resourceUrl, endereco, { observe: 'response' });
  }

  update(endereco: IEndereco): Observable<EntityResponseType> {
    return this.http.put<IEndereco>(`${this.resourceUrl}/${this.getEnderecoIdentifier(endereco)}`, endereco, { observe: 'response' });
  }

  partialUpdate(endereco: PartialUpdateEndereco): Observable<EntityResponseType> {
    return this.http.patch<IEndereco>(`${this.resourceUrl}/${this.getEnderecoIdentifier(endereco)}`, endereco, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEndereco>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEndereco[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEnderecoIdentifier(endereco: Pick<IEndereco, 'id'>): number {
    return endereco.id;
  }

  compareEndereco(o1: Pick<IEndereco, 'id'> | null, o2: Pick<IEndereco, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnderecoIdentifier(o1) === this.getEnderecoIdentifier(o2) : o1 === o2;
  }

  addEnderecoToCollectionIfMissing<Type extends Pick<IEndereco, 'id'>>(
    enderecoCollection: Type[],
    ...enderecosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const enderecos: Type[] = enderecosToCheck.filter(isPresent);
    if (enderecos.length > 0) {
      const enderecoCollectionIdentifiers = enderecoCollection.map(enderecoItem => this.getEnderecoIdentifier(enderecoItem)!);
      const enderecosToAdd = enderecos.filter(enderecoItem => {
        const enderecoIdentifier = this.getEnderecoIdentifier(enderecoItem);
        if (enderecoCollectionIdentifiers.includes(enderecoIdentifier)) {
          return false;
        }
        enderecoCollectionIdentifiers.push(enderecoIdentifier);
        return true;
      });
      return [...enderecosToAdd, ...enderecoCollection];
    }
    return enderecoCollection;
  }
}
