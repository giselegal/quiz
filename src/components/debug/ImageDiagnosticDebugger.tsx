/**
 * Componente de diagnóstico de imagens para desenvolvimento
 * Adicione este componente temporariamente às páginas para analisar problemas em imagens
 */
import React, { useEffect, useState } from 'react';
import { analyzeImageUrl, checkRenderedImages, generateImageReport } from '../utils/images/diagnostic';
import { analyzeImageUrl as jsAnalyzeImageUrl } from '../utils/ImageChecker';

// Estilos para o componente de diagnóstico
const diagnosticStyles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    maxHeight: '500px',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    zIndex: 9999,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    fontSize: '12px',
    fontFamily: 'monospace',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '10px 15px',
    backgroundColor: '#e91e63',
    color: 'white',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: '15px',
    overflowY: 'auto',
    maxHeight: '400px',
  },
  section: {
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '4px',
  },
  imageRow: {
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    marginRight: '10px',
  },
  issue: {
    color: '#ff9800',
    marginBottom: '4px',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    marginRight: '5px',
    fontSize: '11px',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '8px',
    borderRadius: '4px',
    color: 'white',
    width: '100%',
    marginBottom: '10px',
    fontSize: '12px',
  },
  footer: {
    padding: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: '10px',
    backgroundColor: '#ff5722',
    color: 'white',
    fontSize: '10px',
    marginLeft: '5px',
  }
};

const ImageDiagnosticDebugger = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [imageIssues, setImageIssues] = useState([]);
  const [customUrl, setCustomUrl] = useState('');
  const [customUrlAnalysis, setCustomUrlAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);

  // Executar diagnóstico ao montar o componente
  useEffect(() => {
    runDiagnostic();
    // Executar novamente o diagnóstico quando novas imagens forem carregadas
    const observer = new MutationObserver((mutations) => {
      const hasNewImages = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.nodeName === 'IMG' || 
          (node.nodeType === 1 && (node as Element).querySelector('img'))
        )
      );
      if (hasNewImages) {
        setTimeout(runDiagnostic, 1000); // Pequeno atraso para permitir o carregamento
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Executar o diagnóstico de imagens
  const runDiagnostic = () => {
    const report = generateImageReport();
    setSummary(report.summary);
    setImageIssues(report.detailedIssues);
  };

  // Analisar URL personalizada
  const analyzeCustomUrl = () => {
    if (!customUrl) return;
    
    const analysis = jsAnalyzeImageUrl(customUrl);
    setCustomUrlAnalysis(analysis);
  };

  // Destacar imagem com problemas
  const highlightImage = (element) => {
    if (!element) return;
    
    // Remover destaques anteriores
    document.querySelectorAll('.image-diagnostic-highlight').forEach(el => {
      el.classList.remove('image-diagnostic-highlight');
    });
    
    // Adicionar destaque à imagem atual
    element.classList.add('image-diagnostic-highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Adicionar estilo para o destaque se não existir
    if (!document.getElementById('image-diagnostic-styles')) {
      const style = document.createElement('style');
      style.id = 'image-diagnostic-styles';
      style.innerHTML = `
        .image-diagnostic-highlight {
          outline: 4px solid #e91e63 !important;
          outline-offset: 4px !important;
          transition: outline 0.3s ease-out !important;
          animation: pulse-outline 1.5s infinite !important;
        }
        @keyframes pulse-outline {
          0% { outline-color: rgba(233, 30, 99, 0.8); }
          50% { outline-color: rgba(233, 30, 99, 0.3); }
          100% { outline-color: rgba(233, 30, 99, 0.8); }
        }
      `;
      document.head.appendChild(style);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={diagnosticStyles.container as React.CSSProperties}>
      <div style={diagnosticStyles.header as React.CSSProperties}>
        <div>
          📷 Diagnóstico de Imagens
          {summary && (
            <span style={diagnosticStyles.badge as React.CSSProperties}>
              {summary.totalImagesWithIssues}
            </span>
          )}
        </div>
        <button 
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '↑' : '↓'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={diagnosticStyles.content as React.CSSProperties}>
          {summary && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>Resumo</div>
              <div>Total de imagens: {summary.totalImagesRendered}</div>
              <div>Imagens com problemas: {summary.totalImagesWithIssues}</div>
              <div>Bytes totais: {(summary.totalDownloadedBytes / 1024).toFixed(2)} KB</div>
              <div>Impacto no desempenho: {summary.estimatedPerformanceImpact}</div>
            </div>
          )}
          
          <div style={diagnosticStyles.section as React.CSSProperties}>
            <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
              Analisar URL personalizada
            </div>
            <input
              type="text"
              style={diagnosticStyles.input as React.CSSProperties}
              placeholder="Cole a URL da imagem aqui..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={analyzeCustomUrl}
            >
              Analisar
            </button>
          </div>
          
          {customUrlAnalysis && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
                Resultados da análise
              </div>
              <div>Formato: {customUrlAnalysis.format}</div>
              <div>Qualidade: {customUrlAnalysis.quality}</div>
              <div>Largura: {customUrlAnalysis.width}</div>
              <div>Transformações: {customUrlAnalysis.transformations?.length || 0}</div>
              {customUrlAnalysis.suggestions?.length > 0 && (
                <>
                  <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Sugestões:</div>
                  {customUrlAnalysis.suggestions.map((sugestão, i) => (
                    <div key={i} style={diagnosticStyles.issue as React.CSSProperties}>
                      • {sugestão}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          {imageIssues.length > 0 && (
            <div style={diagnosticStyles.section as React.CSSProperties}>
              <div style={diagnosticStyles.sectionTitle as React.CSSProperties}>
                Problemas identificados ({imageIssues.length})
              </div>
              {imageIssues.map((item, index) => (
                <div 
                  key={index} 
                  style={diagnosticStyles.imageRow as React.CSSProperties}
                  onClick={() => highlightImage(item.element)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <img 
                      src={item.url} 
                      style={diagnosticStyles.thumbnail as React.CSSProperties} 
                      alt="Thumbnail" 
                    />
                    <div style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.url.substring(item.url.lastIndexOf('/') + 1)}
                    </div>
                  </div>
                  <div>
                    {item.issues.map((issue, i) => (
                      <div key={i} style={diagnosticStyles.issue as React.CSSProperties}>
                        • {issue}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={runDiagnostic}
            >
              Verificar novamente
            </button>
            <button 
              style={diagnosticStyles.button as React.CSSProperties}
              onClick={() => {
                console.log('Relatório completo gerado:', generateImageReport());
              }}
            >
              Ver no Console
            </button>
          </div>
        </div>
      )}
      
      <div style={diagnosticStyles.footer as React.CSSProperties}>
        Diagnóstico em tempo real • Apenas em desenvolvimento
      </div>
    </div>
  );
};

export default ImageDiagnosticDebugger;
