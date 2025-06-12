import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageUploadService {
    constructor(private configService: ConfigService) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
        if (!file) {
            throw new BadRequestException('No image file provided');
        }

        // Validate file type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new BadRequestException('File size too large. Maximum size is 5MB.');
        }

        try {
            // Convert buffer to base64
            const base64Image = file.buffer.toString('base64');
            const dataURI = `data:${file.mimetype};base64,${base64Image}`;

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: `meals/${userId}`,
                public_id: uuidv4(),
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' }, // Resize to reasonable dimensions
                    { quality: 'auto' }, // Optimize quality
                    { format: 'auto' } // Auto-format for best compression
                ]
            });

            return result.secure_url;
        } catch (error) {
            throw new BadRequestException('Failed to upload image: ' + error.message);
        }
    }

    async deleteImage(imageUrl: string): Promise<void> {
        if (!imageUrl) return;

        try {
            // Extract public_id from URL
            const urlParts = imageUrl.split('/');
            const filenameWithExtension = urlParts[urlParts.length - 1];
            const publicId = filenameWithExtension.split('.')[0];

            // Get the folder path from URL
            const folderIndex = urlParts.findIndex(part => part === 'meals');
            if (folderIndex !== -1) {
                const folderPath = urlParts.slice(folderIndex, -1).join('/');
                const fullPublicId = `${folderPath}/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId);
            }
        } catch (error) {
            // Log error but don't throw - image deletion failure shouldn't break meal deletion
            console.error('Failed to delete image:', error);
        }
    }
} 