export interface ProductApiDto {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface GetProductsApiResponse {
  data: ProductApiDto[];
}

export interface PostProductsApiResponse {
  message: string;
  data: ProductApiDto;
}

export interface UpdateProductsApiResponse {
  message: string;
  data: ProductApiDto;
}

export interface DeleteProductsApiResponse {
  message: string;
}

export interface ApiErrorResponse {
  name: string;
  message: string;
}
