const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const ErrorResponse = require('./errorResponse');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - Type of resource (raw for non-image files)
 * @returns {Promise<Object>} - Cloudinary upload response
 */
const uploadToCloudinary = async (filePath, folder = 'SmartHR/Resumes', resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      type: 'upload',               // ✅ ensures it's publicly accessible
      access_mode: 'public',        // ✅ sets public access
      overwrite: true,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      format: result.format,
      size: result.bytes,
      created_at: result.created_at
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new ErrorResponse('Failed to upload file to cloud storage', 500);
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Type of resource (raw for non-image files)
 * @returns {Promise<Object>} - Cloudinary delete response
 */
const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new ErrorResponse('Failed to delete file from cloud storage', 500);
  }
};

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Cloudinary folder name
 * @param {string} filename - Original filename (should include extension)
 * @param {string} resourceType - Type of resource (raw for non-image files)
 * @param {string} format - File format/extension (pdf, doc, docx)
 * @returns {Promise<Object>} - Cloudinary upload response
 */
const uploadBufferToCloudinary = (buffer, folder = 'hrms/resumes', filename, resourceType = 'raw', format = null) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: folder,
      resource_type: resourceType,
      public_id: filename,
      use_filename: false,
      unique_filename: false,
      type: 'upload',  // Use 'upload' type instead of default
      access_mode: 'public',
      // access_control: [{ access_type: 'anonymous' }]  // Allow anonymous access
      overwrite: true
    };

    // Add format for raw files to ensure proper file type
    if (format && resourceType === 'raw') {
      uploadOptions.format = format;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new ErrorResponse('Failed to upload file to cloud storage', 500));
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
            format: result.format,
            size: result.bytes,
            created_at: result.created_at
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Get file info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {string} resourceType - Type of resource (raw for non-image files)
 * @returns {Promise<Object>} - Cloudinary resource info
 */
const getFileInfo = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });

    return result;
  } catch (error) {
    console.error('Cloudinary get file info error:', error);
    throw new ErrorResponse('Failed to get file info from cloud storage', 500);
  }
};

/**
 * Generate download URL for raw files
 * @param {string} publicId - Cloudinary public ID (with folder path)
 * @returns {string} - Download URL with proper flags
 */
const getDownloadUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    flags: 'attachment',
    secure: true,
    sign_url: true,
    type: 'upload',
  });
};

/**
 * Build candidate download URLs for a raw Cloudinary asset.
 * Signed URLs are required when the Cloudinary account restricts anonymous delivery (401).
 */
const getRawDownloadUrls = (publicId, format = 'pdf') => {
  const basePublicId = publicId.replace(/\.[^/.]+$/, '');
  const urls = [];

  if (process.env.CLOUDINARY_API_SECRET) {
    urls.push(
      cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        secure: true,
      }),
      cloudinary.utils.private_download_url(basePublicId, format, {
        resource_type: 'raw',
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      })
    );
  }

  urls.push(
    cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'upload',
      secure: true,
    })
  );

  return [...new Set(urls.filter(Boolean))];
};

/**
 * Download a raw Cloudinary file as a Buffer (for resume parsing, AI analysis, etc.)
 */
const downloadRawFileBuffer = async (publicId, format = 'pdf') => {
  const urls = getRawDownloadUrls(publicId, format);
  let lastError;

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 60000,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200 && response.data?.byteLength > 0) {
        return Buffer.from(response.data);
      }

      lastError = new Error(`Cloudinary returned status ${response.status} for ${publicId}`);
      console.warn(`[Cloudinary] Download attempt failed (${response.status})`, { publicId, url });
    } catch (error) {
      lastError = error;
      console.warn('[Cloudinary] Download attempt error:', {
        publicId,
        status: error.response?.status,
        message: error.message,
      });
    }
  }

  throw lastError || new Error(`Failed to download file from Cloudinary: ${publicId}`);
};

/**
 * Replace stored fileUrl with a signed delivery URL when cloudinaryId is present.
 */
const withSignedFileUrl = (fileRecord) => {
  if (!fileRecord) return fileRecord;

  const record = fileRecord.toObject ? fileRecord.toObject() : { ...fileRecord };

  if (record.cloudinaryId && process.env.CLOUDINARY_API_SECRET) {
    record.fileUrl = getDownloadUrl(record.cloudinaryId);
  }

  return record;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadBufferToCloudinary,
  getFileInfo,
  getDownloadUrl,
  getRawDownloadUrls,
  downloadRawFileBuffer,
  withSignedFileUrl,
};
