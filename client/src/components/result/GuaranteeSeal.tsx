
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface GuaranteeSealProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GuaranteeSeal: React.FC<GuaranteeSealProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-20 h-20 text-sm',
    lg: 'w-24 h-24 text-base'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50] to-[#388e3c] rounded-full shadow-lg">
        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-6 h-6 text-[#4CAF50] mx-auto mb-1" />
            <span className="font-bold text-[#388e3c] leading-tight block">
              7 DIAS
            </span>
            <span className="font-semibold text-[#4CAF50] text-xs leading-tight block">
              GARANTIA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaranteeSeal;
