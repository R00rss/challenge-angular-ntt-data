// core/core.providers.ts
import { Provider } from '@angular/core';
import { ToastService } from './application/services/toast-service';

export function provideCoreServices(): Provider[] {
  return [ToastService];
}
