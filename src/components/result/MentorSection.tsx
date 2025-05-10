import React from 'react';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import OptimizedImage from '../ui/OptimizedImage';

const MentorSection: React.FC = () => {
  const mentorImageUrl = optimizeCloudinaryUrl(
    "https://res.cloudinary.com/dqljyf76t/image/upload/v1745519576/gisele_mjd4vv.webp",
    { quality: 90, format: 'webp' }
  );

  return (
    <Card className="p-6 sm:p-8 md:p-10 mb-12 bg-gradient-to-br from-[#fdfbf9] to-[#faf5f0] dark:from-[#3a2e26] dark:to-[#332820] shadow-md border border-[#B89B7A]/20 card-elegant">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/3 relative">
          <div className="relative w-[220px] md:w-[280px] mx-auto">
            <OptimizedImage
              src={mentorImageUrl}
              alt="Gisele Galvão - Consultora de Imagem e Estilo"
              width={280}
              height={360}
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 z-10 relative"
              style={{ objectFit: 'cover' }}
            />
            <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-[#B89B7A] dark:border-[#E0C9B1] z-0"></div>
            <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-[#B89B7A] dark:border-[#E0C9B1] z-0"></div>
            <div className="absolute -bottom-4 -right-4 bg-[#B89B7A]/10 dark:bg-[#B89B7A]/20 w-full h-full rounded-xl"></div>
          </div>
          <div className="absolute top-4 right-4 md:-top-3 md:-right-3 bg-white dark:bg-[#2a231e] shadow-md rounded-full p-2">
            <Award className="w-8 h-8 text-[#aa6b5d] dark:text-[#D4B79F]" />
          </div>
        </div>
        
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair text-[#aa6b5d] dark:text-[#D4B79F] mb-3">
            Conheça sua mentora de estilo
          </h2>
          <h3 className="text-lg font-medium text-[#432818] dark:text-[#E0C9B1] mb-4">
            Gisele Galvão — Consultora de Imagem e Estilo
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] rounded-full my-4 md:mx-0 mx-auto"></div>
          <p className="text-[#432818] dark:text-[#d1c7b8] leading-relaxed mb-3">
            Especialista em transformação de imagem há mais de 10 anos, Gisele já ajudou centenas de mulheres a encontrarem seu estilo autêntico e elevarem sua presença pessoal e profissional.
          </p>
          <p className="text-[#432818] dark:text-[#d1c7b8] leading-relaxed">
            Com formação em Consultoria de Imagem e vasta experiência em Personal Styling, Gisele combina expertise técnica com uma abordagem prática e acessível, tornando o conhecimento de moda e estilo aplicável ao dia a dia de mulheres reais.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MentorSection;