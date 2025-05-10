import React from 'react';
import { Card } from '@/components/ui/card';
import Logo from '../ui/logo';
import { StyleResult } from '@/types/quiz';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  logo?: string;
  logoAlt?: string;
  title?: string;
  primaryStyle?: StyleResult;
  logoHeight?: number;
  userName?: string; // Added userName prop
}

export const Header: React.FC<HeaderProps> = ({
  logo = "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
  logoAlt = "Logo Gisele Galvão",
  title = "Olá",
  primaryStyle,
  logoHeight = 80,
  userName // New prop
}) => {
  // Get userName from context if not provided as prop
  const { user } = useAuth();
  const displayName = userName || user?.userName || 'Visitante';
  
  return (
    <Card className="bg-white/95 shadow-md p-4 sm:p-6 md:p-8 mb-6 border border-[#B89B7A]/20">
      <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
        <div className="flex justify-center">
          <Logo 
            src={logo} 
            alt={logoAlt} 
            className="h-auto mx-auto md:mx-0" 
            style={{
              height: `${logoHeight}px`,
              maxWidth: '100%'
            }} 
          />
        </div>
        
        <div className="text-center md:text-right">
          <h1 className="text-lg sm:text-xl md:text-2xl font-playfair text-[#432818]">
            {title} <span className="font-medium">{displayName}</span>, seu Estilo Predominante é:
          </h1>
          
          {primaryStyle && (
            <h2 className="font-bold text-[#B89B7A] mt-2 text-xl sm:text-2xl md:text-3xl">
              {primaryStyle.category}
            </h2>
          )}
        </div>
      </div>
    </Card>
  );
};
