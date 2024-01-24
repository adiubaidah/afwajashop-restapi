import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, FirebaseApp, getApp, getApps } from 'firebase/app';
import {
  getStorage,
  FirebaseStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: FirebaseApp;
  private storage: FirebaseStorage;

  onModuleInit() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    if (!getApps().length) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApp();
    }

    this.storage = getStorage(this.app);
  }

  getFirebaseStorage() {
    return this.storage;
  }

  async uploadFile(image: Express.Multer.File, uploadFolder: string) {
    const imageRef = ref(this.getFirebaseStorage(), uploadFolder);
    const imageBuffer = image.buffer;
    return (await uploadBytes(imageRef, imageBuffer)).ref.fullPath;
  }

  async getDownloadUrl(filePath: string) {
    const fileRef = ref(this.getFirebaseStorage(), filePath);
    const downloadPath = getDownloadURL(fileRef);
    return downloadPath;
  }

  async checkIfFileExists(filePath: string): Promise<boolean> {
    const storageRef = ref(this.getFirebaseStorage(), filePath);

    try {
      getDownloadURL(storageRef);
      return Promise.resolve(true);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return Promise.resolve(false);
      } else {
        return Promise.reject(error);
      }
    }
  }
  async deleteFile(imageName: string) {
    const imageRef = ref(this.getFirebaseStorage(), imageName);
    try {
      await deleteObject(imageRef);
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
