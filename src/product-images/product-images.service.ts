import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase.service';
import { PrismaService } from 'src/prisma.service';
import { ProductImagesDTO } from './product-images.dto';
import { generateString } from 'src/helper';

@Injectable()
export class ProductImagesService {
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async getAllImageByProducttId(productId: string) {
    const result = await this.prismaService.productImages.findMany({
      where: {
        productId,
      },
    });

    const images = await Promise.all(
      result.map(async (data) => {
        const imageUrl = await this.firebaseService.getDownloadUrl(data.image);
        return {
          ...data,
          image: imageUrl,
        };
      }),
    );
    return images;
  }

  async findImage(id: number) {
    const result = await this.prismaService.productImages.findUnique({
      where: {
        id,
      },
    });

    result.image = await this.firebaseService.getDownloadUrl(result.image);

    return result;
  }

  async createImage(data: ProductImagesDTO, image: Express.Multer.File) {
    const uploadedImage = await this.firebaseService.uploadFile(
      image,
      `${process.env.FIREBASE_FOLDER_IMAGE_PRODUCT}/${generateString(12)}.jpg`,
    );

    const result = await this.prismaService.productImages.create({
      data: {
        image: uploadedImage,
        product: {
          connect: {
            id: data.productId,
          },
        },
      },
    });

    return result;
  }

  async deleteImage(id: number) {
    const result = await this.prismaService.productImages.delete({
      where: {
        id,
      },
    });

    const isImageExists = await this.firebaseService.checkIfFileExists(
      result.image,
    );
    if (isImageExists) {
      await this.firebaseService.deleteFile(result.image);
    }
  }
}
