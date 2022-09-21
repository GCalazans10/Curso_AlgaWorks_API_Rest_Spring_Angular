import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LancamentoFormService } from './lancamento-form.service';
import { LancamentoService } from '../service/lancamento.service';
import { ILancamento } from '../lancamento.model';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/pessoa/service/pessoa.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';

import { LancamentoUpdateComponent } from './lancamento-update.component';

describe('Lancamento Management Update Component', () => {
  let comp: LancamentoUpdateComponent;
  let fixture: ComponentFixture<LancamentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lancamentoFormService: LancamentoFormService;
  let lancamentoService: LancamentoService;
  let pessoaService: PessoaService;
  let categoriaService: CategoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LancamentoUpdateComponent],
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
      .overrideTemplate(LancamentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LancamentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lancamentoFormService = TestBed.inject(LancamentoFormService);
    lancamentoService = TestBed.inject(LancamentoService);
    pessoaService = TestBed.inject(PessoaService);
    categoriaService = TestBed.inject(CategoriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const lancamento: ILancamento = { id: 456 };
      const pessoa: IPessoa = { id: 62226 };
      lancamento.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: 55022 }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lancamento });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(
        pessoaCollection,
        ...additionalPessoas.map(expect.objectContaining)
      );
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Categoria query and add missing value', () => {
      const lancamento: ILancamento = { id: 456 };
      const categoria: ICategoria = { id: 78741 };
      lancamento.categoria = categoria;

      const categoriaCollection: ICategoria[] = [{ id: 83622 }];
      jest.spyOn(categoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriaCollection })));
      const additionalCategorias = [categoria];
      const expectedCollection: ICategoria[] = [...additionalCategorias, ...categoriaCollection];
      jest.spyOn(categoriaService, 'addCategoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lancamento });
      comp.ngOnInit();

      expect(categoriaService.query).toHaveBeenCalled();
      expect(categoriaService.addCategoriaToCollectionIfMissing).toHaveBeenCalledWith(
        categoriaCollection,
        ...additionalCategorias.map(expect.objectContaining)
      );
      expect(comp.categoriasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lancamento: ILancamento = { id: 456 };
      const pessoa: IPessoa = { id: 65145 };
      lancamento.pessoa = pessoa;
      const categoria: ICategoria = { id: 43595 };
      lancamento.categoria = categoria;

      activatedRoute.data = of({ lancamento });
      comp.ngOnInit();

      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.categoriasSharedCollection).toContain(categoria);
      expect(comp.lancamento).toEqual(lancamento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILancamento>>();
      const lancamento = { id: 123 };
      jest.spyOn(lancamentoFormService, 'getLancamento').mockReturnValue(lancamento);
      jest.spyOn(lancamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lancamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lancamento }));
      saveSubject.complete();

      // THEN
      expect(lancamentoFormService.getLancamento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(lancamentoService.update).toHaveBeenCalledWith(expect.objectContaining(lancamento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILancamento>>();
      const lancamento = { id: 123 };
      jest.spyOn(lancamentoFormService, 'getLancamento').mockReturnValue({ id: null });
      jest.spyOn(lancamentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lancamento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lancamento }));
      saveSubject.complete();

      // THEN
      expect(lancamentoFormService.getLancamento).toHaveBeenCalled();
      expect(lancamentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILancamento>>();
      const lancamento = { id: 123 };
      jest.spyOn(lancamentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lancamento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lancamentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePessoa', () => {
      it('Should forward to pessoaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pessoaService, 'comparePessoa');
        comp.comparePessoa(entity, entity2);
        expect(pessoaService.comparePessoa).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCategoria', () => {
      it('Should forward to categoriaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoriaService, 'compareCategoria');
        comp.compareCategoria(entity, entity2);
        expect(categoriaService.compareCategoria).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
