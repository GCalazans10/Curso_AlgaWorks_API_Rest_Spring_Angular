import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EnderecoService } from '../service/endereco.service';

import { EnderecoComponent } from './endereco.component';

describe('Endereco Management Component', () => {
  let comp: EnderecoComponent;
  let fixture: ComponentFixture<EnderecoComponent>;
  let service: EnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'endereco', component: EnderecoComponent }]), HttpClientTestingModule],
      declarations: [EnderecoComponent],
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
      .overrideTemplate(EnderecoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnderecoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EnderecoService);

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
    expect(comp.enderecos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to enderecoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEnderecoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEnderecoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
