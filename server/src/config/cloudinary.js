import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const charityStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'golf-charity-platform/charities',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill', quality: 'auto' }]
  }
})

const proofStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'golf-charity-platform/proofs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Auto-compress and cap dimensions — keeps the image readable for admin review
    // while dramatically reducing storage size and processing time
    transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }]
  }
})

const upload = multer({
  storage: charityStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 8 * 1024 * 1024 } // 8 MB max for proof images
})

export { upload, uploadProof }
