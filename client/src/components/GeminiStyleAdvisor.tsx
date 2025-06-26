import React from 'react';

interface GeminiStyleAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiStyleAdvisor: React.FC<GeminiStyleAdvisorProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Fechar conselhos de estilo"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#432818]">Conselhos de Estilo com Gemini</h2>
        <div className="text-[#8F7A6A] text-base mb-2">
          Aqui você poderá receber conselhos personalizados de estilo. (Exemplo de modal, personalize o conteúdo depois)
        </div>
      </div>
    </div>
  );
};

export default GeminiStyleAdvisor;
