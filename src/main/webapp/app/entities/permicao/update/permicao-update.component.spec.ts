import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PermicaoFormService } from './permicao-form.service';
import { PermicaoService } from '../service/permicao.service';
import { IPermicao } from '../permicao.model';

import { PermicaoUpdateComponent } from './permicao-update.component';

describe('Permicao Management Update Component', () => {
  let comp: PermicaoUpdateComponent;
  let fixture: ComponentFixture<PermicaoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let permicaoFormService: PermicaoFormService;
  let permicaoService: PermicaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PermicaoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PermicaoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PermicaoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    permicaoFormService = TestBed.inject(PermicaoFormService);
    permicaoService = TestBed.inject(PermicaoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const permicao: IPermicao = { id: 456 };

      activatedRoute.data = of({ permicao });
      comp.ngOnInit();

      expect(comp.permicao).toEqual(permicao);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPermicao>>();
      const permicao = { id: 123 };
      jest.spyOn(permicaoFormService, 'getPermicao').mockReturnValue(permicao);
      jest.spyOn(permicaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ permicao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: permicao }));
      saveSubject.complete();

      // THEN
      expect(permicaoFormService.getPermicao).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(permicaoService.update).toHaveBeenCalledWith(expect.objectContaining(permicao));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPermicao>>();
      const permicao = { id: 123 };
      jest.spyOn(permicaoFormService, 'getPermicao').mockReturnValue({ id: null });
      jest.spyOn(permicaoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ permicao: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: permicao }));
      saveSubject.complete();

      // THEN
      expect(permicaoFormService.getPermicao).toHaveBeenCalled();
      expect(permicaoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPermicao>>();
      const permicao = { id: 123 };
      jest.spyOn(permicaoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ permicao });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(permicaoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
