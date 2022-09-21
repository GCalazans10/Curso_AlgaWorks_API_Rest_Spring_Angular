import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LancamentoDetailComponent } from './lancamento-detail.component';

describe('Lancamento Management Detail Component', () => {
  let comp: LancamentoDetailComponent;
  let fixture: ComponentFixture<LancamentoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LancamentoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lancamento: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LancamentoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LancamentoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lancamento on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lancamento).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
