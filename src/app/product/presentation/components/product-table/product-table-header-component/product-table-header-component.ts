import { InfoIconComponent } from '@/app/core/presentation/icon/info-icon-component/info-icon-component';
import { Component } from '@angular/core';

@Component({
  selector: 'product-table-header-component',
  imports: [InfoIconComponent],
  templateUrl: './product-table-header-component.html',
  styleUrl: './product-table-header-component.css',
})
export class ProductTableHeaderComponent {
  headers = [
    { name: 'Logo', description: 'Logo del producto', hasToolTip: false },
    {
      name: 'Nombre del producto',
      description: 'Nombre del producto',
      hasToolTip: false,
    },
    {
      name: 'Descripción',
      description: 'Descripción del producto',
      hasToolTip: true,
    },
    {
      name: 'Fecha de liberación',
      description: 'Fecha de liberación del producto',
      hasToolTip: true,
    },
    {
      name: 'Fecha de reestructuración',
      description: 'Fecha de reestructuración del producto',
      hasToolTip: true,
    },
  ];
}
