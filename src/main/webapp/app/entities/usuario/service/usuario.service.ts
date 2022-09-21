import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsuario, NewUsuario } from '../usuario.model';

export type PartialUpdateUsuario = Partial<IUsuario> & Pick<IUsuario, 'id'>;

export type EntityResponseType = HttpResponse<IUsuario>;
export type EntityArrayResponseType = HttpResponse<IUsuario[]>;

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/usuarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(usuario: NewUsuario): Observable<EntityResponseType> {
    return this.http.post<IUsuario>(this.resourceUrl, usuario, { observe: 'response' });
  }

  update(usuario: IUsuario): Observable<EntityResponseType> {
    return this.http.put<IUsuario>(`${this.resourceUrl}/${this.getUsuarioIdentifier(usuario)}`, usuario, { observe: 'response' });
  }

  partialUpdate(usuario: PartialUpdateUsuario): Observable<EntityResponseType> {
    return this.http.patch<IUsuario>(`${this.resourceUrl}/${this.getUsuarioIdentifier(usuario)}`, usuario, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUsuarioIdentifier(usuario: Pick<IUsuario, 'id'>): number {
    return usuario.id;
  }

  compareUsuario(o1: Pick<IUsuario, 'id'> | null, o2: Pick<IUsuario, 'id'> | null): boolean {
    return o1 && o2 ? this.getUsuarioIdentifier(o1) === this.getUsuarioIdentifier(o2) : o1 === o2;
  }

  addUsuarioToCollectionIfMissing<Type extends Pick<IUsuario, 'id'>>(
    usuarioCollection: Type[],
    ...usuariosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const usuarios: Type[] = usuariosToCheck.filter(isPresent);
    if (usuarios.length > 0) {
      const usuarioCollectionIdentifiers = usuarioCollection.map(usuarioItem => this.getUsuarioIdentifier(usuarioItem)!);
      const usuariosToAdd = usuarios.filter(usuarioItem => {
        const usuarioIdentifier = this.getUsuarioIdentifier(usuarioItem);
        if (usuarioCollectionIdentifiers.includes(usuarioIdentifier)) {
          return false;
        }
        usuarioCollectionIdentifiers.push(usuarioIdentifier);
        return true;
      });
      return [...usuariosToAdd, ...usuarioCollection];
    }
    return usuarioCollection;
  }
}
