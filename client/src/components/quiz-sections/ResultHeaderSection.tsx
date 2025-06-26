
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ProgressiveImage from "@/components/ui/progressive-image";
import SecondaryStylesSection from "@/components/quiz-result/SecondaryStylesSection";
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";
import { tokens } from "@/config/designTokens";
import { styleConfig } from "@/config/styleConfig";
import { StyleResult } from "@/types/quiz";

interface ResultHeaderSectionProps {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  user: { userName?: string } | null;
  isLowPerformance: boolean;
  onImageLoad: (imageType: "style" | "guide") => void;
}

const ResultHeaderSection: React.FC<ResultHeaderSectionProps> = ({
  primaryStyle,
  secondaryStyles,
  user,
  isLowPerformance,
  onImageLoad,
}) => {
  const { category, percentage } = primaryStyle;
  const { image, guideImage } = styleConfig[category as keyof typeof styleConfig];

  const getDescriptionText = (cat: string) => {
    switch (cat) {
      case "Natural": return "valoriza autenticidade e conforto, sem abrir mão da elegância natural";
      case "Clássico": return "aprecia sofisticação atemporal e peças que nunca saem de moda";
      case "Contemporâneo": return "está sempre em sintonia com as tendências, mas de forma equilibrada";
      case "Elegante": return "irradia refinamento e classe em cada detalhe do seu visual";
      case "Romântico": return "expressa delicadeza e feminilidade através de looks encantadores";
      case "Sexy": return "tem confiança para valorizar sua sensualidade de forma elegante";
      case "Dramático": return "não tem medo de fazer declarações ousadas com seu estilo";
      case "Criativo": return "expressa criatividade e originalidade em cada combinação de roupas";
      default: return "";
    }
  };

  return (
    <section id="primary-style" className="scroll-mt-24 mb-16 lg:mb-20">
      <Card
        className="relative overflow-hidden bg-gradient-to-br from-white to-[#fff7f3] border rounded-2xl p-8 lg:p-12"
        style={{
          borderColor: tokens.colors.border,
          boxShadow: tokens.shadows.xl
        }}
      >
        {/* Decoração de cantos elegante */}
        <div 
          className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl"
          style={{ borderColor: tokens.colors.border }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl"
          style={{ borderColor: tokens.colors.border }}
        ></div>

        <AnimatedWrapper
          animation="fade"
          show={true}
          duration={600}
          delay={200}
        >
          {/* Header personalizado */}
          <div className="text-center mb-12 lg:mb-16">
            {user?.userName && (
              <AnimatedWrapper
                className="mb-8"
                animation="scale"
                show={true}
                duration={500}
                delay={100}
              >
                <div 
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
                  style={{
                    background: `linear-gradient(to right, ${tokens.colors.backgroundAlt}, ${tokens.colors.background})`,
                    borderColor: tokens.colors.border
                  }}
                >
                  <span 
                    className="text-lg lg:text-xl font-bold bg-clip-text text-transparent"
                    style={{
                      background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`
                    }}
                  >
                    Parabéns, {user.userName}!
                  </span>
                </div>
              </AnimatedWrapper>
            )}

            <h1 
              className="text-2xl lg:text-4xl xl:text-5xl font-playfair mb-8 leading-tight"
              style={{ color: tokens.colors.text }}
            >
              Descobrimos Seu Estilo Predominante:
              <br />
              <span 
                className="text-3xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent mt-1 block"
                style={{
                  background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary}, ${tokens.colors.primary})`
                }}
              >
                {category}
              </span>
            </h1>

            <div className="max-w-lg mx-auto mb-8">
              <div 
                className="flex items-center justify-between text-sm font-medium mb-1"
                style={{ color: tokens.colors.textSecondary }}
              >
                <span>Compatibilidade</span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: tokens.colors.primary }}
                >
                  {percentage}%
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={percentage}
                  className="h-1 rounded-full overflow-hidden border"
                  style={{
                    background: `linear-gradient(to right, #f5f2ec, #f0ebe3)`,
                    borderColor: tokens.colors.borderLight,
                    boxShadow: tokens.shadows.inner
                  }}
                  indicatorStyle={{
                    background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.primaryLight}, ${tokens.colors.secondary})`
                  }}
                  indicatorClassName="transition-all duration-1000 ease-out rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Conteúdo textual */}
            <div className="space-y-8 order-2 lg:order-1">
              <AnimatedWrapper
                animation={isLowPerformance ? "none" : "fade"}
                show={true}
                duration={400}
                delay={300}
              >
                <div className="space-y-6">
                  <div
                    className="rounded-xl p-6 border"
                    style={{
                      background: `linear-gradient(to right, ${tokens.colors.backgroundAlt}, ${tokens.colors.background})`,
                      borderColor: tokens.colors.borderLight,
                      boxShadow: tokens.shadows.sm
                    }}
                  >
                    <p 
                      className="leading-relaxed text-lg font-medium mb-6"
                      style={{ color: tokens.colors.text }}
                    >
                      <strong style={{ color: tokens.colors.secondary }}>
                        Agora você tem clareza total
                      </strong>{" "}
                      sobre quem você é e como expressar sua personalidade
                      através do seu estilo!
                    </p>

                    <div 
                      className="bg-white/60 rounded-lg p-4 border"
                      style={{ borderColor: tokens.colors.borderLight }}
                    >
                      <p 
                        className="text-base leading-relaxed"
                        style={{ color: tokens.colors.text }}
                      >
                        <strong style={{ color: tokens.colors.secondary }}>
                          Seu estilo {category}
                        </strong>{" "}
                        revela uma mulher que{" "}
                        {getDescriptionText(category)}
                        .
                      </p>
                    </div>
                  </div>

                  <div 
                    className="text-center p-4 rounded-lg border"
                    style={{
                      background: `linear-gradient(to right, ${tokens.colors.primary}20, ${tokens.colors.secondary}20)`,
                      borderColor: tokens.colors.borderLight
                    }}
                  >
                    <p 
                      className="text-base font-semibold mb-1"
                      style={{ color: tokens.colors.text }}
                    >
                      <strong>Chega de ficar perdida no guarda-roupa!</strong>
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: tokens.colors.textSecondary }}
                    >
                      Descubra como aplicar seu estilo no dia a dia
                    </p>
                  </div>
                </div>
              </AnimatedWrapper>

              <AnimatedWrapper
                animation={isLowPerformance ? "none" : "fade"}
                show={true}
                duration={400}
                delay={500}
              >
                <div
                  className="rounded-xl p-6 border"
                  style={{
                    background: `linear-gradient(135deg, white, ${tokens.colors.backgroundAlt})`,
                    borderColor: tokens.colors.border,
                    boxShadow: tokens.shadows.md
                  }}
                >
                  <h3 
                    className="text-xl font-semibold mb-6 flex items-center gap-1"
                    style={{ color: tokens.colors.secondary }}
                  >
                    Estilos que Também Influenciam Você
                  </h3>
                  <SecondaryStylesSection secondaryStyles={secondaryStyles} />
                </div>
              </AnimatedWrapper>
            </div>

            {/* Imagem principal */}
            <AnimatedWrapper
              animation={isLowPerformance ? "none" : "scale"}
              show={true}
              duration={500}
              delay={400}
              className="order-1 lg:order-2"
            >
              <div className="relative max-w-md mx-auto">
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{ boxShadow: tokens.shadows.lg }}
                >
                  <ProgressiveImage
                    src={`${image}?q=90&f=auto&w=500`}
                    alt={`Estilo ${category}`}
                    width={500}
                    height={600}
                    className="w-full h-auto transition-all duration-500 hover:scale-105"
                    priority={true}
                    fetchPriority="high"
                    onLoad={() => onImageLoad("style")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                </div>
                <div 
                  className="absolute -top-4 -right-4 text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg"
                  style={{
                    background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`
                  }}
                >
                  <span>{category}</span>
                </div>
                <div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 border-b-3 border-l-3 rounded-bl-xl opacity-60"
                  style={{ borderColor: tokens.colors.primary }}
                ></div>
              </div>
            </AnimatedWrapper>
          </div>

          {/* Guia do estilo */}
          <AnimatedWrapper
            animation={isLowPerformance ? "none" : "fade"}
            show={true}
            duration={400}
            delay={700}
          >
            <div className="mt-16 text-center">
              <h3 
                className="text-2xl lg:text-3xl font-playfair font-bold mb-8"
                style={{ color: tokens.colors.secondary }}
              >
                Seu Guia de Estilo Personalizado
              </h3>
              <div className="relative max-w-3xl mx-auto">
                <ProgressiveImage
                  src={`${guideImage}?q=90&f=auto&w=900`}
                  alt={`Guia de Estilo ${category}`}
                  className="w-full h-auto rounded-xl transition-all duration-500 hover:scale-102"
                  style={{ boxShadow: tokens.shadows.xl }}
                  onLoad={() => onImageLoad("guide")}
                />
                <div 
                  className="absolute -top-1 -right-1 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12 shadow-md"
                  style={{
                    background: `linear-gradient(to right, ${tokens.colors.primary}, ${tokens.colors.secondary})`
                  }}
                >
                  EXCLUSIVO
                </div>
              </div>
            </div>
          </AnimatedWrapper>
        </AnimatedWrapper>
      </Card>
    </section>
  );
};

export default ResultHeaderSection;
