import React from "react";
import { Video, Star, Check, Play, Users, Award, Target } from "lucide-react";
import { QuestionTextOnlyComponent, QuestionTextOnlyData } from "./QuestionTextOnlyComponent";

// Re-export the type for easier imports
export type { QuestionTextOnlyData };

// Interfaces para cada tipo de componente
export interface TitleComponentData {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: "left" | "center" | "right";
}

export interface ParagraphComponentData {
  text: string;
  alignment?: "left" | "center" | "right";
}

export interface ImageComponentData {
  src: string;
  alt: string;
  alignment?: "left" | "center" | "right";
  maxWidth?: string;
  borderRadius?: string;
}

export interface ButtonComponentData {
  text: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  action?: string;
}

export interface VideoComponentData {
  videoUrl?: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
}

export interface TestimonialComponentData {
  text: string;
  name: string;
  role: string;
  avatar?: string;
  rating?: number;
}

export interface PriceComponentData {
  price: string;
  originalPrice?: string;
  installments?: string;
  currency?: string;
  highlight?: boolean;
}

export interface SpacerComponentData {
  height: number;
  showInEditor?: boolean;
}

export interface FormComponentData {
  fields: Array<{
    type: "text" | "email" | "tel" | "textarea" | "select";
    label: string;
    placeholder: string;
    required?: boolean;
    options?: string[];
  }>;
  submitText?: string;
}

// Wrapper para o componente de questão sem imagens
export const ModularQuestionTextOnly: React.FC<{
  data: QuestionTextOnlyData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "8px",
        padding: "16px",
        transition: "all 0.2s ease",
        backgroundColor: isSelected ? "rgba(59, 130, 246, 0.05)" : "transparent",
        ...style,
      }}
    >
      <QuestionTextOnlyComponent
        data={data}
        isSelected={isSelected}
        onClick={onClick}
      />
    </div>
  );
};

// Componente de Título Modular
export const ModularTitle: React.FC<{
  data: TitleComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  const Tag = `h${data.level || 2}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag
      onClick={onClick}
      style={{
        textAlign: data.alignment || "center",
        margin: "1rem 0",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      {data.text || "Título"}
    </Tag>
  );
};

// Componente de Parágrafo Modular
export const ModularParagraph: React.FC<{
  data: ParagraphComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <p
      onClick={onClick}
      style={{
        textAlign: data.alignment || "left",
        lineHeight: "1.6",
        margin: "1rem 0",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      {data.text || "Texto do parágrafo"}
    </p>
  );
};

// Componente de Imagem Modular
export const ModularImage: React.FC<{
  data: ImageComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        textAlign: data.alignment || "center",
        margin: "1rem 0",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      <img
        src={data.src || "https://via.placeholder.com/400x300"}
        alt={data.alt || "Imagem"}
        style={{
          maxWidth: data.maxWidth || "100%",
          height: "auto",
          borderRadius: data.borderRadius || "8px",
          display: "block",
          margin: "0 auto",
        }}
      />
    </div>
  );
};

// Componente de Botão Modular
export const ModularButton: React.FC<{
  data: ButtonComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  const getVariantStyles = () => {
    switch (data.variant) {
      case "secondary":
        return {
          background: "#6b7280",
          color: "white",
          border: "none",
        };
      case "outline":
        return {
          background: "transparent",
          color: "#B89B7A",
          border: "2px solid #B89B7A",
        };
      default:
        return {
          background: "linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%)",
          color: "white",
          border: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (data.size) {
      case "small":
        return { padding: "8px 16px", fontSize: "0.875rem" };
      case "large":
        return { padding: "16px 32px", fontSize: "1.125rem" };
      default:
        return { padding: "12px 24px", fontSize: "1rem" };
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        margin: "1rem 0",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
      onClick={onClick}
    >
      <button
        style={{
          ...getVariantStyles(),
          ...getSizeStyles(),
          borderRadius: "8px",
          fontWeight: "600",
          cursor: "pointer",
          width: data.fullWidth ? "100%" : "auto",
          transition: "all 0.2s ease",
        }}
      >
        {data.text || "BOTÃO"}
      </button>
    </div>
  );
};

// Componente de Vídeo Modular
export const ModularVideo: React.FC<{
  data: VideoComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        margin: "1rem 0",
        textAlign: "center",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#000",
          borderRadius: "12px",
          overflow: "hidden",
          aspectRatio: "16/9",
        }}
      >
        {data.videoUrl ? (
          <iframe
            src={data.videoUrl}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allowFullScreen
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "600",
              gap: "8px",
            }}
          >
            <Play size={48} />
            <span>{data.title || "Vídeo de Vendas"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Depoimento Modular
export const ModularTestimonial: React.FC<{
  data: TestimonialComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        margin: "1.5rem 0",
        padding: "24px",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        border: "1px solid #e9ecef",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <img
          src={
            data.avatar ||
            "https://via.placeholder.com/60x60/B89B7A/FFFFFF?text=👤"
          }
          alt="Avatar"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div style={{ flex: 1 }}>
          {data.rating && (
            <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < data.rating! ? "#fbbf24" : "none"}
                  color="#fbbf24"
                />
              ))}
            </div>
          )}
          <p
            style={{
              fontSize: "1rem",
              fontStyle: "italic",
              marginBottom: "12px",
              color: "#374151",
              lineHeight: "1.6",
            }}
          >
            "{data.text || "Depoimento incrível sobre o produto..."}"
          </p>
          <div>
            <p
              style={{
                fontWeight: "600",
                color: "#432818",
                marginBottom: "4px",
              }}
            >
              {data.name || "Cliente Satisfeito"}
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6B4F43" }}>
              {data.role || "Cliente verificado"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Preço Modular
export const ModularPrice: React.FC<{
  data: PriceComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        margin: "1.5rem 0",
        textAlign: "center",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        borderRadius: "4px",
        padding: "8px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      <div
        style={{
          padding: "32px",
          backgroundColor: data.highlight ? "#B89B7A" : "white",
          color: data.highlight ? "white" : "#432818",
          borderRadius: "16px",
          border: data.highlight ? "none" : "2px solid #B89B7A",
          maxWidth: "400px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {data.highlight && (
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#d97706",
              color: "white",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            OFERTA ESPECIAL
          </div>
        )}
        {data.originalPrice && (
          <div
            style={{
              fontSize: "1.25rem",
              color: data.highlight ? "rgba(255,255,255,0.8)" : "#6B4F43",
              textDecoration: "line-through",
              marginBottom: "8px",
            }}
          >
            De: {data.currency || "R$"} {data.originalPrice}
          </div>
        )}
        <div
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          {data.currency || "R$"} {data.price || "97"}
        </div>
        {data.installments && (
          <div
            style={{
              fontSize: "1rem",
              color: data.highlight ? "rgba(255,255,255,0.9)" : "#6B4F43",
            }}
          >
            ou 12x de {data.currency || "R$"} {data.installments}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Espaçamento Modular
export const ModularSpacer: React.FC<{
  data: SpacerComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        height: `${data.height || 32}px`,
        border: data.showInEditor ? "1px dashed #cbd5e1" : "none",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontSize: "0.75rem",
        opacity: data.showInEditor ? 0.7 : 1,
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      {data.showInEditor && `Espaçamento (${data.height || 32}px)`}
    </div>
  );
};

// Componente de Formulário Modular
export const ModularForm: React.FC<{
  data: FormComponentData;
  style?: React.CSSProperties;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ data, style, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        margin: "1.5rem 0",
        padding: "24px",
        backgroundColor: "white",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        outline: isSelected ? "2px solid #3b82f6" : "none",
        outlineOffset: "2px",
        transition: "all 0.2s ease",
        ...style,
      }}
      className={isSelected ? "bg-blue-50" : ""}
    >
      <form style={{ maxWidth: "400px", margin: "0 auto" }}>
        {data.fields?.map((field, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              {field.label}
              {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                placeholder={field.placeholder}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            ) : field.type === "select" ? (
              <select
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  backgroundColor: "white",
                }}
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px 24px",
            background: "linear-gradient(135deg, #B89B7A 0%, #aa6b5d 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {data.submitText || "ENVIAR"}
        </button>
      </form>
    </div>
  );
};