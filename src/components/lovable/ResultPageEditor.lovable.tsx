
import React from 'react';
import { defineLovable } from "../../../lovable";

export default defineLovable({
  name: "ResultPageEditor",
  displayName: "Editor de Página de Resultado",
  description: "Página de resultado completa para o quiz de estilo",
  category: "Quiz",
  
  defaultProps: {
    userInfo: {
      name: "Visitante",
      showName: true
    },
    primaryStyle: {
      category: "Elegante",
      score: 12,
      percentage: 40,
      title: "Seu Estilo Predominante",
      description: "O Estilo Elegante é sofisticado e valoriza a qualidade em vez da quantidade. Se você tem esse estilo, provavelmente prefere looks clássicos com um toque de modernidade, tecidos nobres e um visual impecável.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
      textColor: "#432818",
      accentColor: "#B89B7A"
    },
    secondaryStyles: {
      title: "Seus Estilos Complementares",
      description: "Estes estilos secundários também fazem parte da sua personalidade e podem ser incorporados ao seu visual",
      styles: [
        {
          category: "Romântico",
          score: 9,
          percentage: 30,
          description: "Feminino e delicado, valoriza rendas, babados e estampas florais."
        },
        {
          category: "Clássico",
          score: 6,
          percentage: 20,
          description: "Atemporal e tradicional, prefere cortes bem estruturados e cores neutras."
        }
      ],
      show: true
    },
    offerSection: {
      show: true,
      title: "Desbloqueie Todo o Potencial do Seu Estilo",
      subtitle: "Guia Completo de Estilo Personalizado",
      description: "Um guia exclusivo baseado no seu tipo de estilo predominante, com dicas práticas para valorizar seu visual todos os dias.",
      productImage: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp",
      bonuses: [
        {
          title: "Paleta de Cores Personalizada",
          description: "Descubra as cores que mais combinam com você",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
        },
        {
          title: "Guia de Combinações",
          description: "Aprenda a criar looks incríveis com o que você já tem",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
        }
      ],
      pricing: {
        price: "R$97",
        regularPrice: "R$197",
        installments: "ou 12x de R$8,90",
        buttonText: "Quero Meu Guia Agora",
        buttonColor: "#B89B7A",
        urgencyText: "Oferta por tempo limitado!"
      }
    },
    mentorSection: {
      show: true,
      name: "Gisele Galvão",
      title: "Sua Mentora de Estilo",
      image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744921536/Sem_nome_1080_x_1000_px_z0chuv.webp",
      bio: [
        "Consultora de imagem com mais de 10 anos de experiência",
        "Especialista em ajudar mulheres a encontrarem seu estilo autêntico",
        "Já transformou o visual de mais de 5.000 mulheres"
      ]
    },
    testimonialSection: {
      show: true,
      title: "O Que Dizem Sobre o Método",
      testimonials: [
        {
          name: "Ana Paula",
          text: "Depois de aplicar as dicas do guia, finalmente me sinto confiante com minhas roupas!",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
        },
        {
          name: "Mariana",
          text: "Economizei muito tempo e dinheiro sabendo exatamente o que combina comigo.",
          imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
        }
      ]
    },
    guaranteeSection: {
      show: true,
      days: 15,
      title: "Garantia de Satisfação",
      description: "Se em até 15 dias você não estiver satisfeita com o conteúdo, devolvemos seu investimento integralmente.",
      imageUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744920983/Espanhol_Portugu%C3%AAs_8_cgrhuw.webp"
    },
    globalStyles: {
      backgroundColor: "#FAF9F7",
      textColor: "#432818",
      accentColor: "#B89B7A",
      fontFamily: "Playfair Display, serif"
    }
  },
  
  propsSchema: {
    userInfo: {
      type: "object",
      displayName: "Informações do Usuário",
      description: "Configurações de personalização para o usuário",
      properties: {
        name: {
          type: "string",
          displayName: "Nome",
          description: "Nome do usuário para personalização"
        },
        showName: {
          type: "boolean",
          displayName: "Mostrar Nome",
          description: "Exibir o nome do usuário na saudação"
        }
      }
    },
    primaryStyle: {
      type: "object",
      displayName: "Estilo Predominante",
      description: "Configurações do estilo principal do resultado",
      properties: {
        category: {
          type: "string",
          displayName: "Categoria",
          description: "Categoria do estilo predominante"
        },
        score: {
          type: "number",
          displayName: "Pontuação",
          description: "Pontuação numérica do estilo"
        },
        percentage: {
          type: "number",
          displayName: "Porcentagem",
          description: "Porcentagem do estilo no total"
        },
        title: {
          type: "string",
          displayName: "Título",
          description: "Título para a seção de estilo predominante"
        },
        description: {
          type: "string",
          displayName: "Descrição",
          description: "Descrição detalhada do estilo predominante"
        },
        imageUrl: {
          type: "string",
          displayName: "URL da Imagem",
          description: "URL da imagem ilustrativa do estilo"
        },
        textColor: {
          type: "color",
          displayName: "Cor do Texto",
          description: "Cor do texto para esta seção"
        },
        accentColor: {
          type: "color",
          displayName: "Cor de Destaque",
          description: "Cor de destaque para esta seção"
        }
      }
    },
    secondaryStyles: {
      type: "object",
      displayName: "Estilos Secundários",
      description: "Configurações dos estilos secundários",
      properties: {
        title: {
          type: "string",
          displayName: "Título",
          description: "Título para a seção de estilos secundários"
        },
        description: {
          type: "string",
          displayName: "Descrição",
          description: "Descrição dos estilos secundários"
        },
        styles: {
          type: "array",
          displayName: "Lista de Estilos",
          description: "Estilos secundários do resultado",
          itemType: {
            type: "object",
            properties: {
              category: {
                type: "string",
                displayName: "Categoria",
                description: "Nome do estilo secundário"
              },
              score: {
                type: "number",
                displayName: "Pontuação",
                description: "Pontuação numérica do estilo"
              },
              percentage: {
                type: "number",
                displayName: "Porcentagem",
                description: "Porcentagem do estilo no total"
              },
              description: {
                type: "string",
                displayName: "Descrição",
                description: "Breve descrição do estilo secundário"
              }
            }
          }
        },
        show: {
          type: "boolean",
          displayName: "Mostrar Seção",
          description: "Exibir a seção de estilos secundários"
        }
      }
    },
    offerSection: {
      type: "object",
      displayName: "Seção de Oferta",
      description: "Configurações da seção de oferta do produto",
      properties: {
        show: {
          type: "boolean",
          displayName: "Mostrar Seção",
          description: "Exibir a seção de oferta"
        },
        title: {
          type: "string",
          displayName: "Título",
          description: "Título principal da oferta"
        },
        subtitle: {
          type: "string",
          displayName: "Subtítulo",
          description: "Subtítulo ou slogan da oferta"
        },
        description: {
          type: "string",
          displayName: "Descrição",
          description: "Descrição detalhada da oferta"
        },
        productImage: {
          type: "string",
          displayName: "Imagem do Produto",
          description: "URL da imagem do produto"
        },
        bonuses: {
          type: "array",
          displayName: "Bônus",
          description: "Lista de bônus incluídos na oferta",
          itemType: {
            type: "object",
            properties: {
              title: {
                type: "string",
                displayName: "Título",
                description: "Título do bônus"
              },
              description: {
                type: "string",
                displayName: "Descrição",
                description: "Descrição do bônus"
              },
              imageUrl: {
                type: "string",
                displayName: "URL da Imagem",
                description: "URL da imagem ilustrativa do bônus"
              }
            }
          }
        },
        pricing: {
          type: "object",
          displayName: "Preços",
          description: "Configurações de preço e pagamento",
          properties: {
            price: {
              type: "string",
              displayName: "Preço",
              description: "Preço atual do produto"
            },
            regularPrice: {
              type: "string",
              displayName: "Preço Regular",
              description: "Preço regular antes do desconto"
            },
            installments: {
              type: "string",
              displayName: "Parcelamento",
              description: "Opções de parcelamento"
            },
            buttonText: {
              type: "string",
              displayName: "Texto do Botão",
              description: "Texto para o botão de compra"
            },
            buttonColor: {
              type: "color",
              displayName: "Cor do Botão",
              description: "Cor para o botão de compra"
            },
            urgencyText: {
              type: "string",
              displayName: "Texto de Urgência",
              description: "Mensagem de urgência para estimular ação"
            }
          }
        }
      }
    },
    mentorSection: {
      type: "object",
      displayName: "Seção da Mentora",
      description: "Configurações da seção sobre a mentora",
      properties: {
        show: {
          type: "boolean",
          displayName: "Mostrar Seção",
          description: "Exibir a seção da mentora"
        },
        name: {
          type: "string",
          displayName: "Nome",
          description: "Nome da mentora"
        },
        title: {
          type: "string",
          displayName: "Título",
          description: "Título ou cargo da mentora"
        },
        image: {
          type: "string",
          displayName: "Imagem",
          description: "URL da imagem da mentora"
        },
        bio: {
          type: "array",
          displayName: "Biografia",
          description: "Pontos da biografia da mentora",
          itemType: {
            type: "string"
          }
        }
      }
    },
    testimonialSection: {
      type: "object",
      displayName: "Seção de Depoimentos",
      description: "Configurações da seção de depoimentos",
      properties: {
        show: {
          type: "boolean",
          displayName: "Mostrar Seção",
          description: "Exibir a seção de depoimentos"
        },
        title: {
          type: "string",
          displayName: "Título",
          description: "Título da seção de depoimentos"
        },
        testimonials: {
          type: "array",
          displayName: "Depoimentos",
          description: "Lista de depoimentos",
          itemType: {
            type: "object",
            properties: {
              name: {
                type: "string",
                displayName: "Nome",
                description: "Nome da pessoa do depoimento"
              },
              text: {
                type: "string",
                displayName: "Texto",
                description: "Texto do depoimento"
              },
              imageUrl: {
                type: "string",
                displayName: "URL da Imagem",
                description: "URL da imagem da pessoa"
              }
            }
          }
        }
      }
    },
    guaranteeSection: {
      type: "object",
      displayName: "Seção de Garantia",
      description: "Configurações da seção de garantia",
      properties: {
        show: {
          type: "boolean",
          displayName: "Mostrar Seção",
          description: "Exibir a seção de garantia"
        },
        days: {
          type: "number",
          displayName: "Dias",
          description: "Número de dias da garantia"
        },
        title: {
          type: "string",
          displayName: "Título",
          description: "Título da seção de garantia"
        },
        description: {
          type: "string",
          displayName: "Descrição",
          description: "Descrição da política de garantia"
        },
        imageUrl: {
          type: "string",
          displayName: "URL da Imagem",
          description: "URL da imagem ilustrativa da garantia"
        }
      }
    },
    globalStyles: {
      type: "object",
      displayName: "Estilos Globais",
      description: "Configurações visuais gerais da página",
      properties: {
        backgroundColor: {
          type: "color",
          displayName: "Cor de Fundo",
          description: "Cor de fundo da página"
        },
        textColor: {
          type: "color",
          displayName: "Cor do Texto",
          description: "Cor padrão para textos"
        },
        accentColor: {
          type: "color",
          displayName: "Cor de Destaque",
          description: "Cor para elementos destacados"
        },
        fontFamily: {
          type: "string",
          displayName: "Família de Fonte",
          description: "Família de fonte principal"
        }
      }
    }
  },
  
  render: ({
    userInfo,
    primaryStyle,
    secondaryStyles,
    offerSection,
    mentorSection,
    testimonialSection,
    guaranteeSection,
    globalStyles
  }) => {
    // Função para calcular o gradiente da barra de progresso
    const getProgressBarStyle = (percentage: number) => {
      return {
        width: `${percentage}%`,
        backgroundColor: globalStyles.accentColor
      };
    };
    
    return (
      <div 
        className="min-h-screen w-full"
        style={{ 
          backgroundColor: globalStyles.backgroundColor, 
          color: globalStyles.textColor,
          fontFamily: globalStyles.fontFamily 
        }}
      >
        {/* Cabeçalho e Saudação */}
        <header className="pt-10 pb-6 text-center">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-playfair mb-4">
              Resultado do Quiz de Estilo Pessoal
            </h1>
            <p className="text-xl">
              {userInfo.showName ? `Olá, ${userInfo.name}! ` : ''}
              Conheça seu estilo predominante e como valorizá-lo!
            </p>
          </div>
        </header>

        {/* Seção do Estilo Predominante */}
        <section className="py-8">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-playfair mb-6 text-center">
              {primaryStyle.title}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={primaryStyle.imageUrl} 
                    alt={`Estilo ${primaryStyle.category}`}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div 
                  className="text-2xl font-medium mb-3 p-4 rounded-lg inline-block"
                  style={{ backgroundColor: globalStyles.accentColor, color: '#fff' }}
                >
                  {primaryStyle.category} ({primaryStyle.percentage}%)
                </div>
                
                <div className="h-4 bg-gray-200 rounded-full w-full mb-6">
                  <div
                    className="h-4 rounded-full" 
                    style={getProgressBarStyle(primaryStyle.percentage)}
                  ></div>
                </div>
                
                <p className="text-lg leading-relaxed mb-4">
                  {primaryStyle.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Estilos Secundários */}
        {secondaryStyles.show && (
          <section className="py-8 bg-white bg-opacity-60">
            <div className="w-full max-w-5xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-playfair mb-4 text-center">
                {secondaryStyles.title}
              </h2>
              <p className="text-center mb-8">{secondaryStyles.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryStyles.styles.map((style, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-medium">{style.category}</h3>
                      <span>{style.percentage}%</span>
                    </div>
                    
                    <div className="h-2 bg-gray-200 rounded-full w-full mb-4">
                      <div
                        className="h-2 rounded-full"
                        style={getProgressBarStyle(style.percentage)}
                      ></div>
                    </div>
                    
                    <p className="text-gray-700">{style.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Seção de Oferta */}
        {offerSection.show && (
          <section className="py-12" style={{ backgroundColor: '#f5f0ea' }}>
            <div className="w-full max-w-5xl mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-playfair mb-3">
                  {offerSection.title}
                </h2>
                <h3 className="text-xl md:text-2xl font-medium mb-4">
                  {offerSection.subtitle}
                </h3>
                <p className="text-lg max-w-2xl mx-auto">
                  {offerSection.description}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                <div className="w-full md:w-1/2">
                  <img 
                    src={offerSection.productImage}
                    alt="Guia de Estilo"
                    className="w-full h-auto rounded-lg shadow-xl"
                  />
                </div>
                
                <div className="w-full md:w-1/2">
                  <h3 className="text-xl font-medium mb-4">O Que Está Incluído:</h3>
                  
                  {offerSection.bonuses.map((bonus, index) => (
                    <div key={index} className="flex gap-4 mb-6">
                      <div className="flex-shrink-0 w-20 h-20">
                        <img
                          src={bonus.imageUrl}
                          alt={bonus.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{bonus.title}</h4>
                        <p className="text-sm opacity-80">{bonus.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 text-center">
                    <div className="mb-4">
                      <div className="text-lg line-through opacity-60">
                        De {offerSection.pricing.regularPrice}
                      </div>
                      <div className="text-3xl font-bold">
                        Por {offerSection.pricing.price}
                      </div>
                      <div className="text-sm opacity-80">
                        {offerSection.pricing.installments}
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-4 px-6 text-lg font-medium text-white rounded-lg shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: offerSection.pricing.buttonColor }}
                    >
                      {offerSection.pricing.buttonText}
                    </button>
                    
                    <p className="mt-3 text-sm font-medium" style={{ color: globalStyles.accentColor }}>
                      {offerSection.pricing.urgencyText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seção da Mentora */}
        {mentorSection.show && (
          <section className="py-10">
            <div className="w-full max-w-5xl mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <img
                    src={mentorSection.image}
                    alt={mentorSection.name}
                    className="w-full h-auto rounded-full shadow-lg"
                  />
                </div>
                
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl md:text-3xl font-playfair mb-2">
                    {mentorSection.title}
                  </h2>
                  <h3 className="text-xl mb-4">{mentorSection.name}</h3>
                  
                  <ul className="space-y-2">
                    {mentorSection.bio.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-lg" style={{ color: globalStyles.accentColor }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seção de Depoimentos */}
        {testimonialSection.show && (
          <section className="py-10 bg-white bg-opacity-60">
            <div className="w-full max-w-5xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-playfair mb-8 text-center">
                {testimonialSection.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonialSection.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex gap-4 items-center mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                    </div>
                    <p className="italic">"{testimonial.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Seção de Garantia */}
        {guaranteeSection.show && (
          <section className="py-10">
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-lg shadow-md">
                <div className="w-full md:w-1/4">
                  <img
                    src={guaranteeSection.imageUrl}
                    alt="Garantia"
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="w-full md:w-3/4">
                  <h2 className="text-xl md:text-2xl font-medium mb-2">
                    {guaranteeSection.title} de {guaranteeSection.days} dias
                  </h2>
                  <p>{guaranteeSection.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Rodapé */}
        <footer className="py-8 text-center text-sm opacity-70">
          <div className="w-full max-w-5xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Gisele Galvão - Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }
});
