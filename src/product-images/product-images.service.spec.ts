import { Test, TestingModule } from '@nestjs/testing';
import { ProductImagesService } from './product-images.service';

describe('ProductImagesService', () => {
  let service: ProductImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductImagesService],
    }).compile();

    service = module.get<ProductImagesService>(ProductImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
