import { ToastService } from '@/app/core/application/services/toast-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toast-component',
  imports: [],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.css',
})
export class ToastComponent {
  constructor(private toastService: ToastService) {}
}
