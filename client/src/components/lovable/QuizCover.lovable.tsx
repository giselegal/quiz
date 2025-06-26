
import React from 'react';
import { defineLovable } from "../../../lovable";

export default defineLovable({
  name: "QuizCover",
  displayName: "Capa do Quiz",
  description: "Bloco de capa do quiz com logo, título, subtítulo e botão de ação",
  category: "Quiz",
  
  defaultProps: {
    logo: {
      src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921536/Sem_nome_1080_x_1000_px_z0chuv.webp",
      alt: "Logo Gisele Galvão"
    },
    backgroundImage: {
      src: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
      alt: "Imagem de fundo"
    },
    headline: "Descubra seu Estilo Pessoal",
    subtitle: "Responda este quiz e receba sua análise de estilo personalizada em minutos",
    button: {
      text: "Começar agora",
      color: "#B89B7A"
    },
    backgroundColor: "#FAF9F7",
    textColor: "#432818"
  },
  
  propsSchema: {
    logo: {
      type: "image",
      displayName: "Logo",
      description: "Logo a ser mostrado no topo"
    },
    backgroundImage: {
      type: "image",
      displayName: "Imagem de Fundo",
      description: "Imagem ilustrativa da capa do quiz"
    },
    headline: {
      type: "string",
      displayName: "Título Principal",
      description: "Título chamativo para o quiz"
    },
    subtitle: {
      type: "string",
      displayName: "Subtítulo",
      description: "Texto complementar que explica o quiz"
    },
    button: {
      type: "object",
      displayName: "Botão",
      description: "Configurações do botão de ação",
      properties: {
        text: {
          type: "string",
          displayName: "Texto do Botão",
          description: "Chamada para ação do botão"
        },
        color: {
          type: "color",
          displayName: "Cor do Botão",
          description: "Cor de fundo do botão"
        }
      }
    },
    backgroundColor: {
      type: "color",
      displayName: "Cor de Fundo",
      description: "Cor de fundo da seção"
    },
    textColor: {
      type: "color",
      displayName: "Cor do Texto",
      description: "Cor principal para os textos"
    }
  },
  
  render: ({ logo, headline, subtitle, button, backgroundImage, backgroundColor, textColor }) => {
    return (
      <div className="min-h-screen flex items-center justify-center w-full py-12" style={{ backgroundColor }}>
        <div className="w-full max-w-5xl px-4 mx-auto">
          <div className="text-center mb-8">
            {logo && (
              <div className="mb-6">
                <img 
                  src={logo.src} 
                  alt={logo.alt || "Logo"} 
                  className="h-24 mx-auto"
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-playfair mb-4"
                style={{ color: textColor }}
              >
                {headline}
              </h1>
              
              <p 
                className="text-lg md:text-xl mb-8 opacity-90"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
              
              <button 
                className="px-8 py-3 text-lg font-medium text-white rounded-lg shadow-lg transform transition-transform hover:scale-105"
                style={{ backgroundColor: button.color }}
              >
                {button.text}
              </button>
            </div>
            
            <div className="w-full md:w-1/2 mt-8 md:mt-0">
              {backgroundImage && (
                <img 
                  src={backgroundImage.src} 
                  alt={backgroundImage.alt || "Imagem do Quiz"} 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
