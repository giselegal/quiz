import React from 'react';
import { StyleResult } from '@/types/quiz';
import { motion } from 'framer-motion';

interface SecondaryStylesSectionProps {
  secondaryStyles: StyleResult[];
}

const SecondaryStylesSection: React.FC<SecondaryStylesSectionProps> = ({ secondaryStyles }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold text-[#2C2C2C] text-center mb-6">
        Seus Estilos Complementares
      </h2>
      
      <div className="space-y-4">
        {secondaryStyles.slice(0, 5).map((style, index) => (
          <div key={style.category} className="flex items-center justify-between p-3 bg-[#FAF9F7] rounded-lg">
            <span className="text-[#2C2C2C] font-medium">{style.category}</span>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-[#E8DDD4] rounded-full h-2">
                <motion.div
                  className="bg-[#8B4513] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${style.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.6 }}
                />
              </div>
              <span className="text-[#8B4513] font-semibold text-sm w-8">{style.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SecondaryStylesSection;
