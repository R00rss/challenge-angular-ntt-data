import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@/app/product/product-module').then((m) => m.ProductModule),
  },
  {
    path: '**',
    redirectTo: '/products',
  },
];
