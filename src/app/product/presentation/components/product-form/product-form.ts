import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { FormValidator } from '@/app/product/domain/validators/form-validator';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'product-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  @Input() initProduct: ProductEntity | null = null;
  @Output() onSubmitForm = new EventEmitter<ProductEntity>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  formKeys: string[] = [];

  productForm!: FormGroup;

  private initializeForm(): void {
    const formBuilderConfig = {
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [FormValidator.isIdUnique(this.productService)],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      dateRelease: [
        '',
        [Validators.required, FormValidator.isReleaseDateGreaterEqualToday()],
      ],
      dateReview: [{ value: '', disabled: true }],
    };

    this.productForm = this.fb.group(formBuilderConfig);
    this.formKeys = Object.keys(formBuilderConfig);

    this.productForm
      .get('dateRelease')
      ?.valueChanges.subscribe((dateRelease) => {
        const newDateReview = dateRelease
          ? FormValidator.calculateDateReview(dateRelease)
          : '';
        this.productForm.get('dateReview')?.setValue(newDateReview);
      });

    if (this.initProduct) {
      this.productForm.patchValue(this.initProduct);
      this.productForm.get('id')?.disable();

      console.log(this.initProduct.dateRelease);
      console.log(typeof this.initProduct.dateRelease);

      const dateReleaseString = this.initProduct.dateRelease
        .toISOString()
        .split('T')[0];
      const newDateReview =
        FormValidator.calculateDateReview(dateReleaseString);

      this.productForm.get('dateRelease')?.setValue(dateReleaseString);
      this.productForm.get('dateReview')?.setValue(newDateReview);
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(
      field &&
      field.errors &&
      field.errors[errorType] &&
      (field.dirty || field.touched)
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        switch (fieldName) {
          case 'id':
            return 'ID no válido!';
          default:
            return 'Este campo es requerido!';
        }
      }

      if (field.errors['minlength']) {
        switch (fieldName) {
          case 'id':
            return 'El ID debe tener al menos 3 caracteres!';
          case 'name':
            return 'El nombre debe tener al menos 5 caracteres!';
          case 'description':
            return 'La descripción debe tener al menos 10 caracteres!';
          default:
            return 'Campo muy corto!';
        }
      }

      if (field.errors['maxlength']) {
        switch (fieldName) {
          case 'id':
            return 'El ID debe tener como máximo 10 caracteres!';
          case 'name':
            return 'El nombre debe tener como máximo 100 caracteres!';
          case 'description':
            return 'La descripción debe tener como máximo 200 caracteres!';
          default:
            return 'Campo muy largo!';
        }
      }

      if (field.errors['invalidReleaseDate']) {
        return 'La fecha debe ser igual o mayor a la fecha actual!';
      }

      if (!field.errors['isIdUnique']) {
        return 'El ID ya está en uso, por favor ingrese otro.';
      }
    }

    return '';
  }

  onSubmit(): void {
    if (!this.productForm.valid) {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });

      const notificationOptions = {
        message:
          'El formulario es inválido. Por favor, corrige los errores y vuelve a intentarlo.',
        type: NotificationType.Error,
      };

      this.notificationService.show(notificationOptions);
      return;
    }

    const newProduct = this.createProductEntity();
    this.onSubmitForm.emit(newProduct);
    // if (!this.isEdit) {
    //   this.productService.createProduct(newProduct);
    // } else {
    //   this.productService.updateProduct(newProduct);
    // }
  }

  createProductEntity(): ProductEntity {
    return {
      dateRelease: new Date(this.productForm.get('dateRelease')?.value),
      dateReview: new Date(this.productForm.get('dateReview')?.value),
      description: this.productForm.get('description')?.value,
      id: this.productForm.get('id')?.value,
      logo: this.productForm.get('logo')?.value,
      name: this.productForm.get('name')?.value,
    };
  }

  onReset(): void {
    this.productForm.reset();
    this.initializeForm();
  }

  isSubmitDisabled(): boolean {
    return this.productForm.invalid;
  }

  isFieldValidating(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.pending);
  }

  getNameByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'id':
        return 'ID';
      case 'name':
        return 'Nombre';
      case 'description':
        return 'Descripción';
      case 'logo':
        return 'Logo';
      case 'dateRelease':
        return 'Fecha Liberación';
      case 'dateReview':
        return 'Fecha Revisión';
      default:
        return itemForm;
    }
  }

  getTypeByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'id':
      case 'name':
      case 'description':
      case 'logo':
      case 'dateReview':
        return 'text';
      case 'dateRelease':
        return 'date';
      default:
        return itemForm;
    }
  }
}
