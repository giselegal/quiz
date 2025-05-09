import React from 'react';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react'; // Ícones para o selo

const GuaranteeSection: React.FC = () => {
  return (
    <Card className="p-6 md:p-8 mb-10 bg-gradient-to-br from-[#fdfaf8] to-[#fbf5ef] dark:from-[#3a2e26] dark:to-[#332820] shadow-xl border border-[#B89B7A]/30 dark:border-[#E0C9B1]/30 card-elegant overflow-hidden rounded-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="md:w-1/4 flex flex-col items-center justify-center text-[#B89B7A] dark:text-[#E0C9B1]">
          <Award size={64} className="mb-3 opacity-80" strokeWidth={1.5} />
          {/* Elemento decorativo elegante */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] dark:from-[#D4B79F] dark:to-[#C8A88A] rounded-full"></div>
        </div>
        
        <div className="md:w-3/4 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-playfair text-[#aa6b5d] dark:text-[#D4B79F] mb-4">
            Sua Satisfação <span className="font-semibold">Garantida</span>
          </h2>
          <p className="text-[#432818] dark:text-[#d1c7b8] mb-3 text-base leading-relaxed">
            Acreditamos tanto na transformação que o Guia de Estilo proporciona que oferecemos uma garantia incondicional.
            Se por qualquer motivo você não ficar 100% satisfeita nos primeiros <strong>7 dias</strong>, basta nos enviar um e-mail e reembolsaremos o valor integral.
          </p>
          <p className="text-[#3a3a3a] dark:text-[#c0b6a7] text-sm">
            Sem perguntas, sem burocracia. Seu investimento é totalmente seguro.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GuaranteeSection;