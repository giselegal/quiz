
import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { ImageUploader } from '../../ui/image-uploader';
import { Switch } from '../../ui/switch';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { useAutoSave } from '../../../hooks/useAutosave';

interface AnimationOptions {
  entrance: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
    delay: number;
  };
  elements: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
    stagger: number;
  };
}

interface StyleOptions {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    title: string;
    body: string;
  };
  spacing: {
    vertical: number;
    horizontal: number;
  };
  shadows: {
    enabled: boolean;
    intensity: 'light' | 'medium' | 'strong';
  };
  borders: {
    radius: number;
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

interface ResponsiveOptions {
  mobileBreakpoint: number;
  mobilePadding: number;
  desktopMaxWidth: number;
  mobileStack: boolean;
  imageSize: {
    desktop: number;
    mobile: number;
  };
}

interface ResultData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaButtonText: string;
  personalityType: string;
  traits: string[];
  animations: AnimationOptions;
  styles: StyleOptions;
  responsive: ResponsiveOptions;
}

const defaultAnimations: AnimationOptions = {
  entrance: {
    type: 'fade',
    duration: 500,
    delay: 0
  },
  elements: {
    type: 'fade',
    duration: 300,
    stagger: 100
  }
};

const defaultStyles: StyleOptions = {
  colors: {
    primary: '#B89B7A',
    secondary: '#8F7A6A',
    background: '#FAF9F7',
    text: '#432818',
    accent: '#aa6b5d'
  },
  fonts: {
    title: 'Playfair Display',
    body: 'Inter'
  },
  spacing: {
    vertical: 24,
    horizontal: 24
  },
  shadows: {
    enabled: true,
    intensity: 'medium'
  },
  borders: {
    radius: 8,
    width: 1,
    style: 'solid'
  }
};

const defaultResponsive: ResponsiveOptions = {
  mobileBreakpoint: 768,
  mobilePadding: 16,
  desktopMaxWidth: 1200,
  mobileStack: true,
  imageSize: {
    desktop: 50,
    mobile: 100
  }
};

const defaultResultData: ResultData = {
  title: 'Seu Resultado',
  subtitle: 'Seu tipo de personalidade é:',
  description: 'Descrição detalhada do resultado...',
  imageUrl: '',
  ctaButtonText: 'Ver Oferta Especial',
  personalityType: 'Tipo de Personalidade',
  traits: ['Característica 1', 'Característica 2', 'Característica 3'],
  animations: defaultAnimations,
  styles: defaultStyles,
  responsive: defaultResponsive
};

interface ResultSectionProps {
  data?: ResultData;
  onChange?: (data: ResultData) => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({ data, onChange }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [resultData, setResultData] = useState<ResultData>(data || defaultResultData);

  const autoSave = useAutoSave({
    onSave: (data) => {
      onChange?.(data);
      // You can add a toast notification here
      console.log('Auto-saved result data');
    }
  });

  const handleChange = (field: keyof ResultData, value: any) => {
    const newData = { ...resultData, [field]: value };
    setResultData(newData);
    autoSave(newData);
  };

  const handleTraitChange = (index: number, value: string) => {
    const newTraits = [...resultData.traits];
    newTraits[index] = value;
    handleChange('traits', newTraits);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Controles de Conteúdo Existentes */}
          <h3 className="text-xl font-semibold text-[#432818] mb-4">Editor de Resultado</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#432818]">Título Principal</label>
              <Input
                value={resultData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Subtítulo</label>
              <Input
                value={resultData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="mt-1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Tipo de Personalidade</label>
              <Input
                value={resultData.personalityType}
                onChange={(e) => handleChange('personalityType', e.target.value)}
                className="mt-1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Descrição</label>
              <Textarea
                value={resultData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Características</label>
              {resultData.traits.map((trait, index) => (
                <Input
                  key={index}
                  value={trait}
                  onChange={(e) => handleTraitChange(index, e.target.value)}
                  className="mt-2"
                  placeholder={`Característica ${index + 1}`}
                />
              ))}
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Imagem do Resultado</label>
              <ImageUploader
                currentImage={resultData.imageUrl}
                onImageUpload={(url) => handleChange('imageUrl', url)}
                className="mt-1"
              />
            </div>
  
            <div>
              <label className="text-sm font-medium text-[#432818]">Texto do Botão CTA</label>
              <Input
                value={resultData.ctaButtonText}
                onChange={(e) => handleChange('ctaButtonText', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
  
      {/* Preview com Animações e Estilos */}
      <div className="bg-[#FAF9F7] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-[#432818] mb-4">Pré-visualização</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-[#432818]">{resultData.title}</h2>
          <h3 className="text-xl text-[#8F7A6A] mt-2">{resultData.subtitle}</h3>
          
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-[#432818]">{resultData.personalityType}</h4>
            <p className="mt-2 text-[#8F7A6A]">{resultData.description}</p>
          </div>
  
          {resultData.imageUrl && (
            <img 
              src={resultData.imageUrl} 
              alt="Resultado" 
              className="mt-4 w-full h-48 object-cover rounded"
            />
          )}
  
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-[#432818]">Suas Características:</h4>
            <ul className="mt-2 space-y-2">
              {resultData.traits.map((trait, index) => (
                <li key={index} className="text-[#8F7A6A]">• {trait}</li>
              ))}
            </ul>
          </div>
  
          <Button className="mt-6 w-full bg-[#B89B7A] hover:bg-[#A38A69] text-white">
            {resultData.ctaButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;
