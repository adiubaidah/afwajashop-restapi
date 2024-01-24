import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
// import { FirebaseService } from './firebase.service';
import { AddressModule } from './address/address.module';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //env file akan bisa bekerja pada semua module
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    AddressModule,
    RegionModule,
    ProductModule,
    ProductImagesModule,
    ProductVariantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(Middleware).forRoutes('user');
  // }
}
