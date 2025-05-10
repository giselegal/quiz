import React, { useState, useEffect } from 'react';
import { trackPixelEvent } from '@/utils/facebookPixel';

const IMAGES = {
  logo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
  impacto: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746650012/oie_eo7u2e.webp',
  mulherShein: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746650306/oie_1_gcozz9.webp',
  bonusVisagismo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911666/C%C3%B3pia_de_Template_Dossi%C3%AA_Completo_2024_15_-_Copia_ssrhu3.webp',
  mockupTabletVisagismo: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745515076/C%C3%B3pia_de_MOCKUPS_10_-_Copia_bvoccn.webp',
  mockupRevistaPecas: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911687/C%C3%B3pia_de_MOCKUPS_12_w8fwrn.webp',
  mockup3Revistas: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_14_oxegnd.webp',
  mockupTodos: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911682/C%C3%B3pia_de_MOCKUPS_13_znzbks.webp',
};

export default function Funil2OfertaDireta() {
  const [nome, setNome] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Dispara ViewContent ao carregar a página
  useEffect(() => {
    trackPixelEvent('ViewContent');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackPixelEvent('Lead', { nome });
    setEnviado(true);
  };

  return (
    <div className="bg-[#fffaf7] min-h-screen flex flex-col items-center px-2 pb-10">
      {/* Cabeçalho */}
      <header className="w-full max-w-2xl flex flex-col items-center pt-6 pb-2">
        <img src={IMAGES.logo} alt="Logo Gisele Galvão" className="h-12 mb-2" loading="lazy" />
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#432818] mb-2">
          Chega de um guarda-roupa lotado e da sensação de que nada combina com você.
        </h1>
        <img src={IMAGES.impacto} alt="Guias de Estilo" className="w-full max-w-md rounded-lg shadow mb-4" loading="lazy" />
      </header>

      {/* Interesse */}
      <section className="w-full max-w-md bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#aa6b5d] text-center mb-2">
          Em poucos minutos, descubra seu <span className="text-[#B89B7A]">Estilo Predominante</span>
        </h2>
        <p className="text-[#433830] text-center mb-4">
          Aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.
        </p>
        {!enviado ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="border border-[#B89B7A] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#B89B7A]"
              required
            />
            <button
              type="submit"
              className="bg-[#B89B7A] hover:bg-[#A1835D] text-white font-semibold rounded-md py-3 transition-all"
              disabled={!nome.trim()}
            >
              Quero Descobrir meu Estilo Agora!
            </button>
          </form>
        ) : (
          <div className="text-center text-green-700 font-semibold py-4">Obrigado! Em breve você receberá novidades.</div>
        )}
      </section>

      {/* Desejo e Bônus */}
      <section className="w-full max-w-2xl bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#432818] mb-2">Ao acessar o Guia de Imagem e Estilo, você terá:</h3>
        <ul className="list-disc list-inside text-[#432818]/90 mb-4 space-y-1">
          <li>Looks com intenção e identidade</li>
          <li>Cores, modelagens e tecidos que te valorizam</li>
          <li>Guarda-roupa funcional, sem compras por impulso</li>
        </ul>
        <div className="mb-4 flex flex-wrap gap-3 justify-center">
          <img src={IMAGES.mockup3Revistas} alt="Guia de Estilo" className="h-28 rounded shadow" loading="lazy" />
          <img src={IMAGES.mockupRevistaPecas} alt="Peças-Chave" className="h-28 rounded shadow" loading="lazy" />
          <img src={IMAGES.mockupTabletVisagismo} alt="Visagismo" className="h-28 rounded shadow" loading="lazy" />
          <img src={IMAGES.mockupTodos} alt="Todos os Bônus" className="h-28 rounded shadow" loading="lazy" />
        </div>
        <div className="bg-[#F9F4EF] rounded-lg p-3 text-[#aa6b5d] text-center font-medium">
          <span className="font-bold">+ Bônus Exclusivos:</span> Peças-chave do Guarda-Roupa de Sucesso, Guia de Visagismo Facial e mais!
        </div>
      </section>

      {/* Quebra de objeção */}
      <section className="w-full max-w-2xl bg-white rounded-lg shadow p-4 sm:p-6 mb-6 flex flex-col items-center">
        <img src={IMAGES.mulherShein} alt="Mulher com sacolas da Shein" className="h-32 sm:h-40 rounded mb-3 object-cover" loading="lazy" />
        <p className="text-[#432818] text-center mb-2">
          Esse valor nem se compara às “blusinhas da Shein” que já ficaram encostadas no seu armário.<br />
          <span className="font-semibold">Esse conhecimento, sim, você vai usar pra sempre</span> — porque transforma a forma como você se veste, se vê e se apresenta.
        </p>
      </section>

      {/* Ação final */}
      <section className="w-full max-w-md bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
        <button
          className="bg-[#B89B7A] hover:bg-[#A1835D] text-white font-semibold rounded-md py-3 px-8 mb-2 transition-all w-full"
        >
          Quero meu Guia de Estilo Agora!
        </button>
        <div className="text-xs text-[#432818]/70 text-center">
          Pagamento único | Acesso imediato | Garantia de 7 dias
        </div>
      </section>
    </div>
  );
}
