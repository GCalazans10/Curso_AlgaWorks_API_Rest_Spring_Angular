import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILancamento, NewLancamento } from '../lancamento.model';

export type PartialUpdateLancamento = Partial<ILancamento> & Pick<ILancamento, 'id'>;

type RestOf<T extends ILancamento | NewLancamento> = Omit<T, 'dataVencimento' | 'dataPagamento' | 'startDate' | 'endDate'> & {
  dataVencimento?: string | null;
  dataPagamento?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type RestLancamento = RestOf<ILancamento>;

export type NewRestLancamento = RestOf<NewLancamento>;

export type PartialUpdateRestLancamento = RestOf<PartialUpdateLancamento>;

export type EntityResponseType = HttpResponse<ILancamento>;
export type EntityArrayResponseType = HttpResponse<ILancamento[]>;

@Injectable({ providedIn: 'root' })
export class LancamentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lancamentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lancamento: NewLancamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lancamento);
    return this.http
      .post<RestLancamento>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(lancamento: ILancamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lancamento);
    return this.http
      .put<RestLancamento>(`${this.resourceUrl}/${this.getLancamentoIdentifier(lancamento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(lancamento: PartialUpdateLancamento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lancamento);
    return this.http
      .patch<RestLancamento>(`${this.resourceUrl}/${this.getLancamentoIdentifier(lancamento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLancamento>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLancamento[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLancamentoIdentifier(lancamento: Pick<ILancamento, 'id'>): number {
    return lancamento.id;
  }

  compareLancamento(o1: Pick<ILancamento, 'id'> | null, o2: Pick<ILancamento, 'id'> | null): boolean {
    return o1 && o2 ? this.getLancamentoIdentifier(o1) === this.getLancamentoIdentifier(o2) : o1 === o2;
  }

  addLancamentoToCollectionIfMissing<Type extends Pick<ILancamento, 'id'>>(
    lancamentoCollection: Type[],
    ...lancamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lancamentos: Type[] = lancamentosToCheck.filter(isPresent);
    if (lancamentos.length > 0) {
      const lancamentoCollectionIdentifiers = lancamentoCollection.map(lancamentoItem => this.getLancamentoIdentifier(lancamentoItem)!);
      const lancamentosToAdd = lancamentos.filter(lancamentoItem => {
        const lancamentoIdentifier = this.getLancamentoIdentifier(lancamentoItem);
        if (lancamentoCollectionIdentifiers.includes(lancamentoIdentifier)) {
          return false;
        }
        lancamentoCollectionIdentifiers.push(lancamentoIdentifier);
        return true;
      });
      return [...lancamentosToAdd, ...lancamentoCollection];
    }
    return lancamentoCollection;
  }

  protected convertDateFromClient<T extends ILancamento | NewLancamento | PartialUpdateLancamento>(lancamento: T): RestOf<T> {
    return {
      ...lancamento,
      dataVencimento: lancamento.dataVencimento?.format(DATE_FORMAT) ?? null,
      dataPagamento: lancamento.dataPagamento?.format(DATE_FORMAT) ?? null,
      startDate: lancamento.startDate?.toJSON() ?? null,
      endDate: lancamento.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLancamento: RestLancamento): ILancamento {
    return {
      ...restLancamento,
      dataVencimento: restLancamento.dataVencimento ? dayjs(restLancamento.dataVencimento) : undefined,
      dataPagamento: restLancamento.dataPagamento ? dayjs(restLancamento.dataPagamento) : undefined,
      startDate: restLancamento.startDate ? dayjs(restLancamento.startDate) : undefined,
      endDate: restLancamento.endDate ? dayjs(restLancamento.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLancamento>): HttpResponse<ILancamento> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLancamento[]>): HttpResponse<ILancamento[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
