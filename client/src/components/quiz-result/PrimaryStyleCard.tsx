
import React from 'react';
import { Card } from '../ui/card';
import { StyleResult } from '@/types/quiz';
import { styleConfig } from '@/config/styleConfig';
import { motion } from 'framer-motion';

interface PrimaryStyleCardProps {
  primaryStyle: StyleResult;
  customDescription?: string;
  customImage?: string;
}

const PrimaryStyleCard: React.FC<PrimaryStyleCardProps> = ({
  primaryStyle,
  customDescription,
  customImage
}) => {
  const imageUrl = customImage || (styleConfig[primaryStyle.category]?.image || '');
  const description = customDescription || (styleConfig[primaryStyle.category]?.description || 'Descrição do estilo não disponível');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <Card className="p-6 bg-white mb-8 shadow-lg border-0">
        <div className="text-center">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-[#2C2C2C] mb-2">
              Seu estilo predominante é
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#8B4513] mb-4">
              {primaryStyle.category}
            </h3>
            
            <p className="text-[#2C2C2C] leading-relaxed text-base mb-4">
              {description}
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#2C2C2C] font-medium">
                  Percentual do seu estilo
                </span>
                <span className="text-sm font-bold text-[#8B4513]">
                  {primaryStyle.percentage}%
                </span>
              </div>
              <div className="w-full bg-[#E8DDD4] rounded-full h-3">
                <motion.div 
                  className="bg-[#8B4513] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${primaryStyle.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-first md:order-last flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            {imageUrl ? (
              <div className="relative overflow-hidden rounded-xl shadow-md">
                <img 
                  src={imageUrl} 
                  alt={`Estilo ${primaryStyle.category}`} 
                  className="w-full h-auto max-h-80 object-contain z-10 relative"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-transparent z-0"
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg w-full h-64 flex items-center justify-center shadow-inner">
                <p className="text-amber-700">Imagem não disponível</p>
              </div>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PrimaryStyleCard;
