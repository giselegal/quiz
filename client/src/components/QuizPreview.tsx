import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QuizLogic } from "@/components/lovable/QuizLogic.lovable";

interface QuizConfig {
  domain: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  pixel: {
    facebookPixelId: string;
    googleAnalyticsId: string;
  };
  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
    term: string;
  };
  scoring: {
    normalQuestionPoints: number;
    strategicQuestionPoints: number;
    autoAdvanceNormal: boolean;
    autoAdvanceStrategic: boolean;
    normalSelectionLimit: number;
    strategicSelectionLimit: number;
  };
  results: {
    showUserName: boolean;
    showPrimaryStyle: boolean;
    showSecondaryStyles: boolean;
    showPercentages: boolean;
    showStyleImages: boolean;
    showStyleGuides: boolean;
  };
}

interface SimplePage {
  id: string;
  title: string;
  type:
    | "intro"
    | "question"
    | "loading"
    | "result"
    | "offer"
    | "transition"
    | "sales"
    | "checkout"
    | "upsell"
    | "thankyou"
    | "webinar"
    | "launch";
  progress: number;
  showHeader: boolean;
  showProgress: boolean;
  components: any[];
}

interface QuizFunnel {
  id: string;
  name: string;
  pages: SimplePage[];
}

const QuizPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [funnel, setFunnel] = useState<QuizFunnel | null>(null);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const funnelParam = searchParams.get("funnel");
    const configParam = searchParams.get("config");

    if (funnelParam) {
      try {
        const funnelData = JSON.parse(decodeURIComponent(funnelParam));
        setFunnel(funnelData);
      } catch (error) {
        console.error("Erro ao decodificar dados do funil:", error);
      }
    }

    if (configParam) {
      try {
        const configData = JSON.parse(decodeURIComponent(configParam));
        setConfig(configData);
      } catch (error) {
        console.error("Erro ao decodificar configurações:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (config) {
      // Aplicar configurações de SEO
      document.title = config.seo.title;

      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", config.seo.description);

      // Meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", config.seo.keywords);

      // Facebook Pixel
      if (config.pixel.facebookPixelId) {
        // Injetar código do Facebook Pixel
        const script = document.createElement("script");
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${config.pixel.facebookPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }

      // Google Analytics
      if (config.pixel.googleAnalyticsId) {
        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.pixel.googleAnalyticsId}`;
        script.async = true;
        document.head.appendChild(script);

        const configScript = document.createElement("script");
        configScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${config.pixel.googleAnalyticsId}');
        `;
        document.head.appendChild(configScript);
      }
    }
  }, [config]);

  if (!funnel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🔍 Preview do Quiz</h1>
          <p className="text-gray-600">Carregando preview...</p>
        </div>
      </div>
    );
  }

  const currentPage = funnel.pages[currentPageIndex];

  const goToNextPage = () => {
    if (currentPageIndex < funnel.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Preview Header */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
        🔍 MODO PREVIEW - {funnel.name} - Página {currentPageIndex + 1} de{" "}
        {funnel.pages.length}
        {config && (
          <span className="ml-4">
            📊 SEO: {config.seo.title} | 🎯 Domínio: {config.domain}
          </span>
        )}
      </div>

      {/* Quiz Content */}
      <div
        className="quiz-preview"
        style={{
          background: "linear-gradient(135deg, #FFFBF7 0%, #FDF8F3 100%)",
          minHeight: "calc(100vh - 48px)",
          padding: "1rem",
        }}
      >
        {/* Header */}
        {currentPage.showHeader && (
          <div
            style={{
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <img
              src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
              alt="Logo"
              style={{
                maxWidth: "120px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {/* Progress Bar */}
        {currentPage.showProgress && (
          <div style={{ padding: "0 1rem 2rem" }}>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#E5E7EB",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${currentPage.progress}%`,
                  background:
                    "linear-gradient(90deg, #B89B7A 0%, #aa6b5d 100%)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="max-w-600px mx-auto" style={{ padding: "0 1rem 2rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#432818",
            }}
          >
            {currentPage.title}
          </h2>

          {/* Render page components */}
          {currentPage.components.map((component, index) => (
            <div key={component.id} style={{ marginBottom: "1rem" }}>
              {component.type === "title" && (
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    textAlign: component.style?.textAlign || "center",
                    color: component.style?.color || "#432818",
                    marginBottom: "1rem",
                  }}
                >
                  {component.data.text}
                </h1>
              )}

              {component.type === "subtitle" && (
                <h2
                  style={{
                    fontSize: "1.25rem",
                    textAlign: component.style?.textAlign || "center",
                    color: component.style?.color || "#6B4F43",
                    marginBottom: "1rem",
                  }}
                >
                  {component.data.text}
                </h2>
              )}

              {component.type === "text" && (
                <p
                  style={{
                    textAlign: component.style?.textAlign || "left",
                    color: component.style?.color || "#374151",
                    marginBottom: "1rem",
                  }}
                >
                  {component.data.text}
                </p>
              )}

              {component.type === "image" && (
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <img
                    src={component.data.src}
                    alt={component.data.alt || "Imagem"}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              {component.type === "button" && (
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <button
                    onClick={goToNextPage}
                    style={{
                      backgroundColor: "#B89B7A",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#aa6b5d";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#B89B7A";
                    }}
                  >
                    {component.data.text}
                  </button>
                </div>
              )}

              {component.type === "options" && (
                <div style={{ marginBottom: "1rem" }}>
                  {component.data.options?.map(
                    (option: any, optionIndex: number) => (
                      <div
                        key={option.id}
                        style={{
                          padding: "12px",
                          marginBottom: "8px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#B89B7A";
                          e.currentTarget.style.backgroundColor = "#FEF7F0";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {option.image && (
                          <img
                            src={option.image}
                            alt={option.text}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "4px",
                              marginBottom: "8px",
                            }}
                          />
                        )}
                        <div style={{ fontWeight: "500", color: "#432818" }}>
                          {option.text}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2rem",
              padding: "1rem 0",
            }}
          >
            <button
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              style={{
                backgroundColor: currentPageIndex === 0 ? "#D1D5DB" : "#6B7280",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: currentPageIndex === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Anterior
            </button>

            <span
              style={{
                alignSelf: "center",
                color: "#6B7280",
                fontSize: "0.875rem",
              }}
            >
              {currentPage.type} • {currentPageIndex + 1}/{funnel.pages.length}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === funnel.pages.length - 1}
              style={{
                backgroundColor:
                  currentPageIndex === funnel.pages.length - 1
                    ? "#D1D5DB"
                    : "#B89B7A",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor:
                  currentPageIndex === funnel.pages.length - 1
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>

      {/* Debug Info (only in preview) */}
      {config && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "10px",
            maxWidth: "300px",
          }}
        >
          <div>
            <strong>🎯 UTM:</strong> {config.utm.source}/{config.utm.medium}
          </div>
          <div>
            <strong>📊 Pixel FB:</strong> {config.pixel.facebookPixelId}
          </div>
          <div>
            <strong>🔧 Scoring:</strong> Normal:
            {config.scoring.normalSelectionLimit} | Estratégico:
            {config.scoring.strategicSelectionLimit}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPreview;
