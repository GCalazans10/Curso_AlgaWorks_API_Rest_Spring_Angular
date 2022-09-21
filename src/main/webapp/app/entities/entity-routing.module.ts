import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'endereco',
        data: { pageTitle: 'algaWorksApp.endereco.home.title' },
        loadChildren: () => import('./endereco/endereco.module').then(m => m.EnderecoModule),
      },
      {
        path: 'pessoa',
        data: { pageTitle: 'algaWorksApp.pessoa.home.title' },
        loadChildren: () => import('./pessoa/pessoa.module').then(m => m.PessoaModule),
      },
      {
        path: 'categoria',
        data: { pageTitle: 'algaWorksApp.categoria.home.title' },
        loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'algaWorksApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'permicao',
        data: { pageTitle: 'algaWorksApp.permicao.home.title' },
        loadChildren: () => import('./permicao/permicao.module').then(m => m.PermicaoModule),
      },
      {
        path: 'lancamento',
        data: { pageTitle: 'algaWorksApp.lancamento.home.title' },
        loadChildren: () => import('./lancamento/lancamento.module').then(m => m.LancamentoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
