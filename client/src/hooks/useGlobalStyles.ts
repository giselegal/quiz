import { useEffect, useState } from 'react';

interface GlobalStyles {
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  logoHeight?: number;
  logo?: string;
  logoAlt?: string;
  primaryButton?: string; // Added primaryButton
}

export const useGlobalStyles = () => {
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>(() => {
    const saved = localStorage.getItem('global_styles');
    return saved ? JSON.parse(saved) : {
      backgroundColor: '#fff',
      textColor: '#432818',
      fontFamily: 'inherit',
      logoHeight: 56,
      logo: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      logoAlt: "Logo Gisele Galvão",
      // Added default style for primaryButton, inspired by QuizIntro button but simplified
      primaryButton: 'bg-[#B89B7A] text-white font-semibold hover:bg-[#A08469] focus:ring-2 focus:ring-[#DBC0A5] focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md'
    };
  });

  useEffect(() => {
    localStorage.setItem('global_styles', JSON.stringify(globalStyles));
  }, [globalStyles]);

  const updateGlobalStyles = (newStyles: Partial<GlobalStyles>) => {
    setGlobalStyles(prev => ({ ...prev, ...newStyles }));
  };

  return { globalStyles, updateGlobalStyles };
};
