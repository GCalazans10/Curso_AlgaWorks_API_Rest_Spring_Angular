import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PermicaoDetailComponent } from './permicao-detail.component';

describe('Permicao Management Detail Component', () => {
  let comp: PermicaoDetailComponent;
  let fixture: ComponentFixture<PermicaoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermicaoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ permicao: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PermicaoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PermicaoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load permicao on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.permicao).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
