
import React from 'react';
import { Card } from '@/components/ui/card';

const MotivationSection: React.FC = () => {
  return (
    <Card className="p-6 mb-10 bg-white shadow-md border border-[#B89B7A]/20 card-elegant">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] mb-4">
          Por que definir seu estilo é tão importante?
        </h2>
        <div className="elegant-divider w-32 mx-auto"></div>
        <p className="text-[#432818] mb-6">
          Conhecer seu estilo pessoal é muito mais do que seguir tendências passageiras —
          é uma ferramenta poderosa de <strong>comunicação não-verbal</strong> e <strong>autoconfiança</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="bg-[#fff7f3] p-4 rounded-lg border border-[#B89B7A]/10">
            <h3 className="font-medium text-[#aa6b5d] mb-2">Quando você não conhece seu estilo...</h3>
            <ul className="text-[#432818] space-y-2">
              <li>• Compra peças por impulso que não combinam entre si</li>
              <li>• Sente que tem um guarda-roupa cheio, mas "nada para vestir"</li>
              <li>• Investe em tendências que não valorizam sua imagem</li>
              <li>• Tem dificuldade em criar uma imagem coerente e autêntica</li>
            </ul>
          </div>
          <div className="bg-[#f9f4ef] p-4 rounded-lg border border-[#B89B7A]/10">
            <h3 className="font-medium text-[#aa6b5d] mb-2">Quando você domina seu estilo...</h3>
            <ul className="text-[#432818] space-y-2">
              <li>• Economiza tempo e dinheiro em compras conscientes</li>
              <li>• Projeta a imagem que realmente representa você</li>
              <li>• Aumenta sua confiança em qualquer ambiente</li>
              <li>• Cria looks harmoniosos com menos peças</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MotivationSection;
