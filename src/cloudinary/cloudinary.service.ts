/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    public async uploadImageOnCloud(file:Express.Multer.File,folder:string): Promise<UploadApiResponse > {
        try {
            const result = await cloudinary.uploader.upload(
                file.path,
                {
                    folder,
                }
                
            )
            return result
        } catch (error) {
            console.error(error)
            throw error ;

        }

    }
}
