import React from 'react';
import { Card } from '@/components/ui/card';

const MotivationSection: React.FC = () => {
  return (
    <Card className="p-6 sm:p-8 h-full bg-white shadow-md border border-[#B89B7A]/20 card-elegant">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-playfair text-[#aa6b5d] mb-4">
          Por que definir seu estilo é tão importante?
        </h2>
        <div className="elegant-divider w-32 mx-auto"></div>
        <p className="text-[#432818] mb-6">
          Conhecer seu estilo pessoal é muito mais do que seguir tendências passageiras —
          é uma ferramenta poderosa de <strong>comunicação não-verbal</strong> e <strong>autoconfiança</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="bg-[#fff7f3] p-5 rounded-lg border border-[#B89B7A]/10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-medium text-[#aa6b5d] mb-3">Quando você não conhece seu estilo...</h3>
            <ul className="text-[#432818] space-y-2.5">
              <li className="flex items-start">
                <span className="text-[#aa6b5d] mr-2">•</span>
                <span>Compra peças por impulso que não combinam entre si</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#aa6b5d] mr-2">•</span>
                <span>Sente que tem um guarda-roupa cheio, mas "nada para vestir"</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#aa6b5d] mr-2">•</span>
                <span>Investe em tendências que não valorizam sua imagem</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#aa6b5d] mr-2">•</span>
                <span>Tem dificuldade em criar uma imagem coerente e autêntica</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#f9f4ef] p-5 rounded-lg border border-[#B89B7A]/10 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-medium text-[#aa6b5d] mb-3">Quando você domina seu estilo...</h3>
            <ul className="text-[#432818] space-y-2.5">
              <li className="flex items-start">
                <span className="text-[#B89B7A] mr-2">•</span>
                <span>Economiza tempo e dinheiro em compras conscientes</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B89B7A] mr-2">•</span>
                <span>Projeta a imagem que realmente representa você</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B89B7A] mr-2">•</span>
                <span>Conquista mais segurança e presença nas interações</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B89B7A] mr-2">•</span>
                <span>Cria um guarda-roupa versátil e que reflete sua essência</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MotivationSection;
