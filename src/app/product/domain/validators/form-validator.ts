import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { ProductService } from '../../application/services/product-service';

export class FormValidator {
  static isSearching = false;

  static isIdUnique(productService: ProductService): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const id = control.value;
      if (!id) return null;
      return timer(500).pipe(
        switchMap(() => {
          return productService.checkProductExists(id).pipe(
            map((exists) => (exists ? { isIdUnique: false } : null)),
            catchError((error) => {
              console.error('Error al verificar la existencia del ID:', error);
              return of(null);
            })
          );
        })
      );
    };
  }

  static isReleaseDateGreaterEqualToday(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const releaseDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return releaseDate >= today ? null : { invalidReleaseDate: true };
    };
  }

  static calculateDateReview(releaseDateString: string): string {
    const releaseDate = new Date(releaseDateString);
    releaseDate.setFullYear(releaseDate.getFullYear() + 1);
    return releaseDate.toISOString().split('T')[0];
  }
}
