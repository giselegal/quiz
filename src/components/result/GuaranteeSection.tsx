import React from 'react';
import { Card } from '@/components/ui/card';
import { Award, Shield, Clock } from 'lucide-react';

const GuaranteeSection: React.FC = () => {
  return (
    <Card className="p-6 sm:p-8 h-full bg-gradient-to-br from-[#fdfaf8] to-[#fbf5ef] dark:from-[#3a2e26] dark:to-[#332820] shadow-xl border border-[#B89B7A]/30 dark:border-[#E0C9B1]/30 card-elegant overflow-hidden rounded-xl">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="md:w-1/3 flex flex-col items-center justify-center text-[#B89B7A] dark:text-[#E0C9B1]">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-dashed border-[#B89B7A]/30 dark:border-[#E0C9B1]/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-[#FAF5F0] to-[#F5EDE5] dark:from-[#3E332B] dark:to-[#362D25] rounded-full shadow-inner"></div>
            <div className="relative z-10 flex flex-col items-center justify-center">
              <Shield size={32} strokeWidth={1.5} className="text-[#aa6b5d] dark:text-[#D4B79F] mb-1" />
              <span className="text-xl font-bold text-[#aa6b5d] dark:text-[#D4B79F]">7 dias</span>
              <span className="text-xs text-[#8F7A6A] dark:text-[#C0B6A7]">garantia</span>
            </div>
          </div>
          
          {/* Elemento decorativo elegante */}
          <div className="w-24 h-1 bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] dark:from-[#D4B79F] dark:to-[#C8A88A] rounded-full mt-6"></div>
        </div>
        
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair text-[#aa6b5d] dark:text-[#D4B79F] mb-4">
            Sua Satisfação <span className="font-semibold">Garantida</span>
          </h2>
          
          <p className="text-[#432818] dark:text-[#d1c7b8] mb-4 text-base leading-relaxed">
            Acreditamos tanto na transformação que o Guia de Estilo proporciona que oferecemos uma garantia incondicional.
          </p>
          
          <div className="bg-white/50 dark:bg-black/10 p-4 rounded-lg mb-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#aa6b5d] dark:text-[#D4B79F] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#432818] dark:text-[#d1c7b8]">
                Se por qualquer motivo você não ficar 100% satisfeita nos primeiros <strong>7 dias</strong>, basta nos enviar um e-mail.
              </p>
              <p className="text-sm text-[#8F7A6A] dark:text-[#C0B6A7] mt-1">
                Devolveremos 100% do seu investimento sem questionamentos.
              </p>
            </div>
          </div>
          
          <p className="text-[#3a3a3a] dark:text-[#c0b6a7] text-sm font-medium flex items-center justify-center md:justify-start">
            <Award className="w-4 h-4 mr-2 text-[#B89B7A] dark:text-[#E0C9B1]" />
            Seu investimento é totalmente seguro.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GuaranteeSection;