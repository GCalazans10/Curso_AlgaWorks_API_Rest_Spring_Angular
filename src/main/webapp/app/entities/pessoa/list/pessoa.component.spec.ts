import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PessoaService } from '../service/pessoa.service';

import { PessoaComponent } from './pessoa.component';

describe('Pessoa Management Component', () => {
  let comp: PessoaComponent;
  let fixture: ComponentFixture<PessoaComponent>;
  let service: PessoaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pessoa', component: PessoaComponent }]), HttpClientTestingModule],
      declarations: [PessoaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(PessoaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PessoaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PessoaService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.pessoas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pessoaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPessoaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPessoaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
