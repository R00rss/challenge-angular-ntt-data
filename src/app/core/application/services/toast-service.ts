import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type ToastServiceState = {
  isOpen: boolean;
  message: string | null;
  type: ToastType | null;
};

const initialState: ToastServiceState = {
  isOpen: false,
  message: null,
  type: null,
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _state = new BehaviorSubject<ToastServiceState>(initialState);
  readonly state$ = this._state.asObservable();
  readonly message$ = this._state
    .asObservable()
    .pipe(map((state) => state.message));

  readonly type$ = this._state.asObservable().pipe(map((state) => state.type));
  readonly isOpen$ = this._state
    .asObservable()
    .pipe(map((state) => state.isOpen));

  show(message: string, type: ToastType): void {
    this._state.next({ isOpen: true, message, type });
  }

  hide(): void {
    this._state.next({ isOpen: false, message: null, type: null });
  }
}
