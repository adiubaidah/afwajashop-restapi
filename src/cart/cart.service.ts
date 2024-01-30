import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CartDTO } from './cart.dto';
import { FirebaseService } from 'src/firebase.service';

@Injectable()
export class CartService {
  constructor(
    private prismaService: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async getCart(userId: string) {
    const result = await this.prismaService.cart.findMany({
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
        productVariant: true,
      },
    });

    // gambar di download dan di hitung sub total
    const carts = await Promise.all(
      result.map(async (cart) => {
        let imageUrl: string;
        if (cart.product.productImages.length > 0) {
          imageUrl = await this.firebaseService.getDownloadUrl(
            cart.product.productImages[0].image,
          );
        }
        const subTotal = cart.productVariant.price * cart.quantity;

        return { ...cart, image: imageUrl, subTotal };
      }),
    );
    return carts;
  }

  async addCart(userId: string, cart: CartDTO) {
    const { quantity, productId, productVariantId } = cart;

    //dicek terlebih dahulu stok nya
    const checkAvailableVariant =
      await this.prismaService.productVariants.findFirst({
        where: {
          id: productVariantId,
        },
      });
    if (checkAvailableVariant.stock === 0) {
      throw new ConflictException('Barang sudah habis');
    }

    if (checkAvailableVariant.stock < quantity) {
      throw new ConflictException('Tidak boleh melebihi stok');
    }
    const result = await this.prismaService.cart.create({
      data: {
        quantity,
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
        productVariant: {
          connect: {
            id: productVariantId,
          },
        },
      },
    });
    return result;
  }

  async editCart(cartId: string, cart: CartDTO) {
    const { quantity, productId, productVariantId } = cart;
    const checkAvailableVariant =
      await this.prismaService.productVariants.findFirst({
        where: {
          id: productVariantId,
        },
      });
    if (checkAvailableVariant.stock === 0) {
      throw new ConflictException('Barang sudah habis');
    }

    if (checkAvailableVariant.stock < quantity) {
      throw new ConflictException('Tidak boleh melebihi stok');
    }

    const result = await this.prismaService.cart.update({
      where: {
        id: cartId,
      },
      data: {
        quantity,
        product: {
          connect: {
            id: productId,
          },
        },
        productVariant: {
          connect: {
            id: productVariantId,
          },
        },
      },
    });
    return result;
  }

  async deleteCart(cartId: string) {
    const result = await this.prismaService.cart.delete({
      where: {
        id: cartId,
      },
    });
    return result;
  }
}
