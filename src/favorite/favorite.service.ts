import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FirebaseService } from 'src/firebase.service';
import { FavoriteDTO } from './favorite.dto';
@Injectable()
export class FavoriteService {
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async getFavorite(userId: string) {
    const result = await this.prismaService.favorite.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        product: {
          include: {
            productImages: {
              select: {
                image: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    // gambar di download dan di hitung sub total
    const favorites = await Promise.all(
      result.map(async (favorite) => {
        let imageUrl: string;
        if (favorite.product.productImages.length > 0) {
          imageUrl = await this.firebaseService.getDownloadUrl(
            favorite.product.productImages[0].image,
          );
        }
        return { ...favorite, image: imageUrl };
      }),
    );
    return favorites;
  }

  async addFavorite(userId: string, favorite: FavoriteDTO) {
    const { productId } = favorite;

    //dicek terlebih dahulu stok nya
    const result = await this.prismaService.favorite.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
    return result;
  }

  async editFavorite(favoriteId: string, favorite: FavoriteDTO) {
    const { productId } = favorite;
    const result = await this.prismaService.favorite.update({
      where: {
        id: favoriteId,
      },
      data: {
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
    return result;
  }

  async deleteFavorite(favoriteId: string) {
    const result = await this.prismaService.favorite.delete({
      where: {
        id: favoriteId,
      },
    });
    return result;
  }
}
