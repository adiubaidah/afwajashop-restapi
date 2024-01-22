import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FirebaseService } from 'src/firebase.service';
import { ProfileDTO } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private firebase: FirebaseService,
  ) {}

  async upsert(
    userId: string,
    profile: ProfileDTO,
    image: Express.Multer.File,
  ) {
    //jika request ada gambarnya, query mencari gambar lama
    // lalu update
    let oldImage: string = '';
    let newImage: string = '';

    const oldProfile = await this.prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (image) {
      if (oldProfile && oldProfile.image) {
        oldImage = oldProfile.image;
        await this.firebase.deleteFile(oldProfile.image);
      }
      // upload gambar baru
      newImage = await this.firebase.uploadFile(
        image,
        `${process.env.FIREBASE_FOLDER_IMAGE_PROFILE}/${userId}.jpg`,
      );
    }

    // jika ada profile lama maka lakukan update
    if (oldProfile) {
      const updatedProfile = await this.prisma.profile.update({
        where: {
          userId,
        },
        data: {
          ...profile,
          image: newImage || oldImage,
        },
      });
      return updatedProfile;
    } else {
      //jika tidak maka buat profile baru
      const updatedProfile = await this.prisma.profile.create({
        data: {
          ...profile,
          userId,
          image: newImage || oldImage,
        },
      });
      return updatedProfile;
    }
  }
}
