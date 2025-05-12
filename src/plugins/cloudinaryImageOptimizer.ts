
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { extname } from 'path';

interface Options {
  apiKey?: string;
  apiSecret?: string;
  cloudName?: string;
  secure?: boolean;
  baseUrl?: string;
  assetUrl?: string;
  quality?: number;
  format?: string;
  responsive?: boolean;
  maxWidth?: number;
  steps?: number;
  expires?: number;
  bypassCache?: boolean;
}

// Helper function for type checking
const checkTypeAndIncludes = (value: unknown, search: string): boolean => {
  if (typeof value === 'string') {
    return value.includes(search);
  }
  if (Array.isArray(value)) {
    return value.includes(search);
  }
  return false;
};

export default function cloudinaryImageOptimizer(options: Options = {}) {
  // Default options if not provided
  const {
    apiKey = process.env.CLOUDINARY_API_KEY || '',
    apiSecret = process.env.CLOUDINARY_API_SECRET || '',
    cloudName = process.env.CLOUDINARY_CLOUD_NAME || '',
    secure = true,
    baseUrl = '',
    assetUrl = '',
    quality = 80,
    format = 'auto',
    responsive = true,
    maxWidth = 1920,
    steps = 5,
    expires = 31536000,
    bypassCache = false,
  } = options;

  return async (req: IncomingMessage, res: ServerResponse, next: Function) => {
    const parsedUrl = parse(req.url || '', true);
    let imagePath = parsedUrl.pathname || '';

    if (typeof imagePath === 'string' && imagePath.includes('/_next/image')) {
      const imageUrl = parsedUrl.query.url as string;
      const imageWidth = parseInt(parsedUrl.query.w as string, 10);

      if (!imageUrl || isNaN(imageWidth)) {
        return next();
      }

      imagePath = imageUrl;
      const imageName = imagePath.split('/').pop()?.split('.')[0] || '';
      const imageExtension = extname(imagePath).slice(1);

      if (!['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(imageExtension)) {
        return next();
      }

      const optimizedWidth = Math.min(imageWidth, maxWidth);
      const calculatedSteps = responsive ? Math.ceil(optimizedWidth / steps) * steps : optimizedWidth;

      const transformations = [
        { width: calculatedSteps, quality, format, fetch_format: 'auto' },
      ];

      const publicId = `${imageName}`;
      const imageUrlTransformed = getCloudinaryUrl(publicId, transformations, {
        apiKey,
        apiSecret,
        cloudName,
        secure,
        baseUrl,
        assetUrl,
        expires,
        bypassCache,
      });

      res.setHeader('Cache-Control', `public, max-age=${expires}, immutable`);
      res.setHeader('Content-Type', `image/${format}`);

      // Safe way to handle response methods
      const originalWrite = res.write;
      const originalEnd = res.end;
      
      // Use type assertions for TypeScript compatibility
      // @ts-ignore: TypeScript doesn't fully understand the types here
      res.write = function(chunk: any) {
        return originalWrite.call(this, chunk);
      };
      
      // @ts-ignore: TypeScript doesn't fully understand the types here
      res.end = function(chunk?: any) {
        return originalEnd.call(this, chunk);
      };

      try {
        const imageResponse = await fetch(imageUrlTransformed);
        if (!imageResponse.ok) {
          console.error('Cloudinary Image Optimization Error:', imageResponse.status, imageResponse.statusText);
          return next();
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(imageBuffer);
        res.write(buffer);
        res.end();
      } catch (error) {
        console.error('Cloudinary Image Optimization Error:', error);
        return next();
      }
    } else {
      next();
    }
  };
}

interface Transformation {
  width: number;
  quality: number;
  format: string;
  fetch_format: string;
}

interface CloudinaryOptions {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  secure: boolean;
  baseUrl: string;
  assetUrl: string;
  expires: number;
  bypassCache: boolean;
}

function getCloudinaryUrl(
  publicId: string,
  transformations: Transformation[],
  options: CloudinaryOptions
): string {
  const { apiKey, apiSecret, cloudName, secure, baseUrl, assetUrl, expires, bypassCache } = options;

  const cloudUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  const transformationString = transformations
    .map((t) => `w_${t.width},q_${t.quality},f_${t.format},fetch_format_${t.fetch_format}`)
    .join('/');

  let imageUrl = `${cloudUrl}${transformationString}/${publicId}`;

  if (assetUrl) {
    imageUrl = `${assetUrl}${publicId}`;
  }

  if (bypassCache) {
    imageUrl += `?_=${Date.now()}`;
  }

  return imageUrl;
}
