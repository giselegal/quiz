import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { QuizOption as QuizOptionType } from "@/types/quiz";
import { highlightStrategicWords } from "@/utils/textHighlight";
import { QuizOptionImage } from "./QuizOptionImage";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check } from "lucide-react";
import { RippleEffect, PulseEffect } from "../effects/InteractionEffects";
import { ParticleSystem } from "../effects/ParticleSystem";
import "../../styles/enchanted-effects.css";

interface QuizOptionProps {
  option: QuizOptionType;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  type: "text" | "image" | "both";
  questionId?: string;
  isDisabled?: boolean;
  isStrategicOption?: boolean; // Nova prop
}

const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  isSelected,
  onSelect,
  type,
  questionId,
  isDisabled = false,
  isStrategicOption = false, // Padrão para false
}) => {
  const isMobile = useIsMobile();
  const is3DQuestion =
    option.imageUrl?.includes("sapatos") || option.imageUrl?.includes("calca");
  const optionRef = useRef<HTMLDivElement>(null);

  // Estados para efeitos encantadores
  const [isHovered, setIsHovered] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Usar useEffect para lidar com mudanças de isSelected sem causar flash
  useEffect(() => {
    if (optionRef.current) {
      if (isSelected) {
        // Para opções de texto - manter borda amarela
        if (type === "text") {
          optionRef.current.style.borderColor = "#b29670";
          optionRef.current.style.boxShadow = isStrategicOption
            ? "0 6px 12px rgba(178, 150, 112, 0.4)" // Sombra mais pronunciada para estratégicas
            : "0 4px 8px rgba(178, 150, 112, 0.25)";

          if (isStrategicOption) {
            // Destacar mais as opções estratégicas selecionadas
            optionRef.current.style.backgroundColor = "#faf6f1";
            optionRef.current.style.transform = "translateY(-2px)";
          }
        }
        // Para opções de imagem - sem borda, apenas sombra
        else {
          optionRef.current.style.borderColor = "transparent";
          optionRef.current.style.boxShadow = isStrategicOption
            ? "0 15px 30px rgba(0, 0, 0, 0.25)" // Sombra mais pronunciada para estratégicas
            : "0 12px 24px rgba(0, 0, 0, 0.2)";
        }
      } else {
        if (type === "text") {
          optionRef.current.style.borderColor = "#B89B7A";
          optionRef.current.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";

          if (isStrategicOption) {
            // Resetar estilo para opções estratégicas não selecionadas
            optionRef.current.style.backgroundColor = "#FEFEFE";
            optionRef.current.style.transform = "translateY(0)";
          }
        } else {
          optionRef.current.style.borderColor = "transparent";
          optionRef.current.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
        }
      }
    }
  }, [isSelected, type, isStrategicOption]);

  // Manipulador de clique customizado com debounce
  const handleClick = () => {
    if (!isDisabled) {
      // Se já está selecionado e é uma questão estratégica, não permitimos desmarcar
      if (isSelected && isStrategicOption) {
        return; // Impede desmarcar a opção em questões estratégicas
      }

      // Aplicar mudança visual imediatamente para feedback instantâneo
      if (optionRef.current) {
        if (type === "text") {
          optionRef.current.style.borderColor = isSelected
            ? "#B89B7A"
            : "#b29670";

          // Efeito visual adicional para opções estratégicas
          if (isStrategicOption && !isSelected) {
            optionRef.current.style.backgroundColor = "#faf6f1";
            optionRef.current.style.transform = "translateY(-2px)";
          }
        }

        // Aplicar sombra correspondente ao estado
        optionRef.current.style.boxShadow = isSelected
          ? "0 2px 4px rgba(0, 0, 0, 0.05)"
          : isStrategicOption
          ? type === "text"
            ? "0 6px 12px rgba(178, 150, 112, 0.4)"
            : "0 15px 30px rgba(0, 0, 0, 0.25)"
          : type === "text"
          ? "0 4px 8px rgba(178, 150, 112, 0.25)"
          : "0 12px 24px rgba(0, 0, 0, 0.2)";
      }

      // Chamar onSelect com um pequeno atraso para evitar flash
      setTimeout(() => {
        onSelect(option.id);
      }, 10);
    }
  };

  return (
    <div
      className={cn(
        "relative h-full",
        isDisabled && isStrategicOption
          ? "opacity-45 cursor-not-allowed transition-opacity duration-300"
          : isDisabled
          ? "opacity-50 cursor-not-allowed"
          : ""
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Conteúdo principal com ref para manipulação direta do DOM */}
      <div
        ref={optionRef}
        className={cn(
          "relative h-full flex flex-col rounded-lg overflow-hidden",
          "cursor-pointer",

          // Para opções de texto - manter borda e adicionar efeito hover com cor da marca
          type === "text" &&
            cn(
              "p-4 border transition-all duration-300",
              isHovered &&
                !isSelected &&
                "border-[#B89B7A] bg-[#B89B7A]/5 shadow-lg",
              "bg-[#FEFEFE] shadow-sm hover:shadow-md"
            ),

          // Para opções de imagem - SEM fundo, SEM padding, SEM borda para melhor aproveitamento do grid
          type !== "text" &&
            cn(
              "border-0 p-0 bg-transparent shadow-none",
              "hover:shadow-lg transition-all duration-300"
            )
        )}
      >
        {type !== "text" && option.imageUrl && (
          <QuizOptionImage
            imageUrl={option.imageUrl}
            altText={option.text}
            styleCategory={option.styleCategory}
            isSelected={isSelected}
            is3DQuestion={is3DQuestion}
            questionId={questionId || ""}
          />
        )}

        <p
          className={cn(
            type !== "text"
              ? cn(
                  "leading-tight font-medium py-1 px-2 mt-auto text-[#432818] relative",
                  isMobile ? "text-[0.85rem]" : "text-[0.8rem] sm:text-sm",
                  isStrategicOption && "text-[1rem] sm:text-base font-semibold", // Maior e bold para opções estratégicas
                  "font-inter antialiased", // Fonte mais legível
                  "bg-white/90 backdrop-blur-sm rounded-b-lg" // Fundo semi-transparente apenas para o texto
                )
              : cn(
                  "leading-relaxed text-[#432818] font-inter antialiased",
                  isMobile ? "text-[1rem]" : "text-[1.05rem] sm:text-lg",
                  isStrategicOption && "text-[1.2rem] sm:text-xl font-semibold", // Maior e bold para opções estratégicas texto
                  !isStrategicOption && "text-[1.1rem] sm:text-lg font-medium" // Melhor legibilidade para opções só texto
                )
          )}
        >
          {highlightStrategicWords(option.text)}
        </p>

        {/* Indicador de seleção - check com círculo para questões estratégicas */}
        {isSelected &&
          (isStrategicOption ? (
            <div className="absolute -top-1 -right-1 h-7 w-7 bg-[#b29670] rounded-full flex items-center justify-center shadow-lg z-10">
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
          ) : (
            <Check
              className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[#b29670] z-10"
              strokeWidth={3}
            />
          ))}
      </div>
    </div>
  );
};

export { QuizOption };
