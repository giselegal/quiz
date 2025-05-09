import { StyleCategory } from '@/types/quiz';

/**
 * Interface for image metadata in the image bank
 */
export interface BankImage {
  id: string;                // Unique identifier
  src: string;               // URL of the image
  alt: string;               // Alt text for accessibility
  category: string;          // Category (question type, style, etc)
  styleCategory?: StyleCategory; // Style category for quiz options
  tags?: string[];           // Optional tags for filtering
  width?: number;            // Original width if known
  height?: number;           // Original height if known
  preloadPriority?: number;  // Priority for preloading (1-5, higher = higher priority)
}

/**
 * Interface for categories in the image bank
 */
export interface ImageCategory {
  id: string;
  name: string;
  description?: string;
  images: BankImage[];
}

/**
 * Image bank data structure
 */
const imageBank: ImageCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing Styles',
    description: 'Images related to clothing style questions',
    images: [
      {
        id: 'natural-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
        alt: 'Conforto, leveza e praticidade no vestir',
        category: 'clothing',
        styleCategory: 'Natural',
        preloadPriority: 4
      },
      {
        id: 'classic-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
        alt: 'Discrição, caimento clássico e sobriedade',
        category: 'clothing',
        styleCategory: 'Clássico',
        preloadPriority: 4
      },
      {
        id: 'contemporary-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
        alt: 'Praticidade com um toque de estilo atual',
        category: 'clothing',
        styleCategory: 'Contemporâneo',
        preloadPriority: 4
      },
      {
        id: 'elegant-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
        alt: 'Elegância refinada, moderna e sem exageros',
        category: 'clothing',
        styleCategory: 'Elegante',
        preloadPriority: 4
      },
      {
        id: 'romantic-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
        alt: 'Delicadeza em tecidos suaves e fluidos',
        category: 'clothing',
        styleCategory: 'Romântico',
        preloadPriority: 4
      },
      {
        id: 'sexy-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
        alt: 'Sensualidade com destaque para o corpo',
        category: 'clothing',
        styleCategory: 'Sexy',
        preloadPriority: 4
      },
      {
        id: 'dramatic-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
        alt: 'Impacto visual com peças estruturadas e assimétricas',
        category: 'clothing',
        styleCategory: 'Dramático',
        preloadPriority: 4
      },
      {
        id: 'creative-clothing',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
        alt: 'Mix criativo com formas ousadas e originais',
        category: 'clothing',
        styleCategory: 'Criativo',
        preloadPriority: 4
      }
    ]
  },
  {
    id: 'visual',
    name: 'Visual Styles',
    description: 'Images for visual style questions',
    images: [
      {
        id: 'natural-visual',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
        alt: 'Visual leve, despojado e natural',
        category: 'visual',
        styleCategory: 'Natural',
        preloadPriority: 4
      },
      {
        id: 'classic-visual',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
        alt: 'Visual clássico e tradicional',
        category: 'visual',
        styleCategory: 'Clássico',
        preloadPriority: 4
      },
      {
        id: 'contemporary-visual',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
        alt: 'Visual casual com toque atual',
        category: 'visual',
        styleCategory: 'Contemporâneo',
        preloadPriority: 4
      },
      {
        id: 'elegant-visual',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
        alt: 'Visual refinado e imponente',
        category: 'visual',
        styleCategory: 'Elegante',
        preloadPriority: 4
      },
      {
        id: 'romantic-visual',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
        alt: 'Visual romântico, feminino e delicado',
        category: 'visual',
        styleCategory: 'Romântico',
        preloadPriority: 4
      }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Images related to accessories questions',
    images: [
      {
        id: 'natural-shoes',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp',
        alt: 'Tênis nude casual e confortável',
        category: 'accessories',
        styleCategory: 'Natural',
        preloadPriority: 3
      },
      {
        id: 'classic-shoes',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp',
        alt: 'Scarpin nude de salto baixo',
        category: 'accessories',
        styleCategory: 'Clássico',
        preloadPriority: 3
      }
    ]
  },
  {
    id: 'branding',
    name: 'Branding',
    description: 'Images related to brand and logos',
    images: [
      {
        id: 'main-logo',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp', // URL Limpa
        alt: 'Logo Gisele Galvão',
        category: 'branding',
        preloadPriority: 5
      },
      {
        id: 'intro-image',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp', // URL Limpa
        alt: 'Mulher elegante com roupas estilosas',
        category: 'branding',
        preloadPriority: 5,
        width: 800, 
        height: 800 
      }
    ]
  },
  // New category for strategic questions
  {
    id: 'strategic',
    name: 'Strategic Questions',
    description: 'Images for strategic questions',
    images: [
      {
        id: 'strategic-7-image',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/t_Antes%20e%20Depois%20-%20de%20Descobrir%20seu%20Estilo/v1745459978/20250423_1704_Transforma%C3%A7%C3%A3o_no_Closet_Moderno_simple_compose_01jsj3xvy6fpfb6pyd5shg5eak_1_appany.webp',
        alt: 'Transformação no Closet Moderno',
        category: 'strategic',
        preloadPriority: 4
      }
    ]
  },
  // New category for transformation images
  {
    id: 'transformation',
    name: 'Before After Transformations',
    description: 'Before and after transformation images',
    images: [
      {
        id: 'transformation-adriana-before',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/antes_adriana_pmdn8y.webp',
        alt: 'Adriana - Antes',
        category: 'transformation',
        preloadPriority: 3,
        width: 800,
        height: 1000
      },
      {
        id: 'transformation-adriana-after',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745519979/depois_adriana_pmdn8y.webp',
        alt: 'Adriana - Depois',
        category: 'transformation',
        preloadPriority: 3,
        width: 800,
        height: 1000
      },
      {
        id: 'transformation-mariangela-before',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/antes_mariangela_cpugfj.webp',
        alt: 'Mariangela - Antes',
        category: 'transformation',
        preloadPriority: 3,
        width: 800,
        height: 1000
      },
      {
        id: 'transformation-mariangela-after',
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745522326/depois_mariangela_cpugfj.webp',
        alt: 'Mariangela - Depois',
        category: 'transformation',
        preloadPriority: 3,
        width: 800,
        height: 1000
      }
    ]
  }
];

/**
 * Get all images in the bank
 */
export const getAllImages = (): BankImage[] => {
  return imageBank.flatMap(category => category.images);
};

/**
 * Get images by category
 * @param categoryId Category ID to filter by
 */
export const getImagesByCategory = (categoryId: string): BankImage[] => {
  const category = imageBank.find(cat => cat.id === categoryId);
  return category?.images || [];
};

/**
 * Get images by style category
 * @param styleCategory Style category to filter by
 */
export const getImagesByStyleCategory = (styleCategory: StyleCategory): BankImage[] => {
  return getAllImages().filter(img => img.styleCategory === styleCategory);
};

/**
 * Get an image by ID
 * @param id Image ID to find
 */
export const getImageById = (id: string): BankImage | undefined => {
  for (const category of imageBank) {
    const image = category.images.find(img => img.id === id);
    if (image) return image;
  }
  return undefined;
};

/**
 * Get an image by source URL
 * @param src Source URL to find
 */
export const getImageBySrc = (src: string): BankImage | undefined => {
  const normalizedSrc = src.split('?')[0]; // Remove query parameters
  for (const category of imageBank) {
    const image = category.images.find(img => img.src.split('?')[0] === normalizedSrc);
    if (image) return image;
  }
  return undefined;
};

/**
 * Get high priority images for preloading
 * @param minPriority Minimum priority level (1-5)
 */
export const getHighPriorityImages = (minPriority = 4): BankImage[] => {
  return getAllImages().filter(img => (img.preloadPriority || 0) >= minPriority);
};

export default imageBank;
