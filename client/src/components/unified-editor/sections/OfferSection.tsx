
import React, { useState } from 'react';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { ImageUploader } from '../../ui/image-uploader';
import { useAutoSave } from '../../../hooks/useAutosave';

interface OfferData {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  price: string;
  discountPrice: string;
  features: string[];
  countdown: boolean;
  showTestimonials: boolean;
}

const defaultOfferData: OfferData = {
  title: 'Título da Oferta',
  description: 'Descrição da oferta aqui...',
  imageUrl: '',
  buttonText: 'Comprar Agora',
  price: 'R$ 197,00',
  discountPrice: 'R$ 97,00',
  features: ['Característica 1', 'Característica 2', 'Característica 3'],
  countdown: true,
  showTestimonials: true
};

interface OfferSectionProps {
  data?: OfferData;
  onChange?: (data: OfferData) => void;
}

const OfferSection: React.FC<OfferSectionProps> = ({ data, onChange }) => {
  const [offerData, setOfferData] = useState<OfferData>(data || defaultOfferData);

  const autoSave = useAutoSave({
    onSave: (data) => {
      onChange?.(data);
      console.log('Auto-saved offer data');
    }
  });

  const handleChange = (field: keyof OfferData, value: any) => {
    const newData = { ...offerData, [field]: value };
    setOfferData(newData);
    autoSave(newData);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...offerData.features];
    newFeatures[index] = value;
    handleChange('features', newFeatures);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#432818] mb-4">Editor de Oferta</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#432818]">Título da Oferta</label>
              <Input
                value={offerData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#432818]">Descrição</label>
              <Textarea
                value={offerData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#432818]">Preço Original</label>
                <Input
                  value={offerData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#432818]">Preço com Desconto</label>
                <Input
                  value={offerData.discountPrice}
                  onChange={(e) => handleChange('discountPrice', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#432818]">Características</label>
              {offerData.features.map((feature, index) => (
                <Input
                  key={index}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="mt-2"
                  placeholder={`Característica ${index + 1}`}
                />
              ))}
            </div>

            <div>
              <label className="text-sm font-medium text-[#432818]">Imagem do Produto</label>
              <ImageUploader
                currentImage={offerData.imageUrl}
                onImageUpload={(url) => handleChange('imageUrl', url)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#432818]">Texto do Botão</label>
              <Input
                value={offerData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview da Oferta */}
      <div className="bg-[#FAF9F7] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-[#432818] mb-4">Pré-visualização</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-[#432818]">{offerData.title}</h2>
          
          {offerData.imageUrl && (
            <img 
              src={offerData.imageUrl} 
              alt="Produto" 
              className="mt-4 w-full h-48 object-cover rounded"
            />
          )}
          
          <p className="mt-4 text-[#8F7A6A]">{offerData.description}</p>
          
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xl font-semibold text-[#B89B7A]">{offerData.discountPrice}</span>
            <span className="text-sm text-gray-500 line-through">{offerData.price}</span>
          </div>
          
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-[#432818]">O que você vai receber:</h4>
            <ul className="mt-2 space-y-2">
              {offerData.features.map((feature, index) => (
                <li key={index} className="text-[#8F7A6A] flex items-start">
                  <span className="mr-2">✓</span> {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <Button className="mt-6 w-full bg-[#B89B7A] hover:bg-[#A38A69] text-white">
            {offerData.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
