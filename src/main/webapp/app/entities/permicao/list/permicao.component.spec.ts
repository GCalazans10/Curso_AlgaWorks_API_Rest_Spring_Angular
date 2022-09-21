import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PermicaoService } from '../service/permicao.service';

import { PermicaoComponent } from './permicao.component';

describe('Permicao Management Component', () => {
  let comp: PermicaoComponent;
  let fixture: ComponentFixture<PermicaoComponent>;
  let service: PermicaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'permicao', component: PermicaoComponent }]), HttpClientTestingModule],
      declarations: [PermicaoComponent],
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
      .overrideTemplate(PermicaoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PermicaoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PermicaoService);

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
    expect(comp.permicaos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to permicaoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPermicaoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPermicaoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
