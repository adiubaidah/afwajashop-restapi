import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDTO } from './category.dto';
import { FirebaseService } from 'src/firebase.service';
import { generateString } from 'src/helper';
@Injectable()
export class CategoryService {
  constructor(
    private prismaServce: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async allCategory() {
    const result = await this.prismaServce.category.findMany();
    const categories = await Promise.all(
      result.map(async (data) => {
        const imageUrl = await this.firebaseService.getDownloadUrl(data.image);
        return {
          ...data,
          image: imageUrl,
        };
      }),
    );
    return categories;
  }

  async findCategory(id: number) {
    return await this.prismaServce.category.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async addCategory(data: CategoryDTO, image: Express.Multer.File) {
    const newImage = await this.firebaseService.uploadFile(
      image,
      `${process.env.FIREBASE_FOLDER_IMAGE_CATEGORY}/${generateString(8)}.jpg`,
    );

    const result = await this.prismaServce.category.create({
      data: {
        ...data,
        image: newImage,
      },
    });

    return result;
  }

  async editCategory(
    id: number,
    data: CategoryDTO,
    image?: Express.Multer.File,
  ) {
    const newImage = await this.firebaseService.uploadFile(
      image,
      `${process.env.FIREBASE_FOLDER_IMAGE_CATEGORY}/${generateString(8)}.jpg`,
    );

    const result = await this.prismaServce.category.update({
      where: {
        id,
      },
      data: {
        ...data,
        image: newImage,
      },
    });

    return result;
  }

  async deleteCategory(id: number) {
    const result = await this.prismaServce.category.delete({
      where: {
        id,
      },
    });

    if (await this.firebaseService.checkIfFileExists(result.image)) {
      await this.firebaseService.deleteFile(result.image);
    }
    return result;
  }
}
