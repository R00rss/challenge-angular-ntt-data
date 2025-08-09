import ProductEntity from '../../domain/entities/product.entity';
import { ProductApiDto } from '../dto/product-api.dto';

export class ProductMapper {
  static fromDto(dto: ProductApiDto): ProductEntity {
    const { date_release, date_revision, ...rest } = dto;

    return {
      ...rest,
      dateRelease: new Date(date_release),
      dateReview: new Date(date_revision),
    };
  }

  static fromDtoList(dtos: ProductApiDto[]): ProductEntity[] {
    return dtos.map((dto) => this.fromDto(dto));
  }

  static toDto(entity: ProductEntity): ProductApiDto {
    const { dateRelease, dateReview, ...rest } = entity;

    return {
      ...rest,
      date_release: dateRelease.toISOString().split('T')[0],
      date_revision: dateReview.toISOString().split('T')[0],
    };
  }
}
