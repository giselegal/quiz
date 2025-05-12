import React, { useState, useEffect } from 'react';
import { getAllImages } from '@/data/imageBank';
import { optimizeCloudinaryUrl, getResponsiveImageSources } from '@/utils/imageUtils';
import { ImageAnalysis, ImageDiagnosticResult } from '@/utils/images/types';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface ImageDiagnosticDebuggerProps {
  isVisible: boolean;
}

const ImageDiagnosticDebugger: React.FC<ImageDiagnosticDebuggerProps> = ({ isVisible }) => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [analysisResults, setAnalysisResults] = useState<ImageAnalysis[]>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<ImageDiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState({
    quality: 80,
    format: 'auto',
    responsive: true,
  });
  const [customUrl, setCustomUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!isVisible) return;

    setIsLoading(true);
    // Wait for the DOM to be fully loaded
    const waitForImages = () => {
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
      if (imgs.length > 0) {
        setImages(imgs);
        setIsLoading(false);
      } else {
        setTimeout(waitForImages, 500); // Check again after 500ms
      }
    };

    waitForImages();
  }, [isVisible]);

  const analyzeImage = async (url: string): Promise<ImageAnalysis> => {
    const isCloudinary = url.includes('cloudinary.com');
    const optimizedUrl = isCloudinary ? optimizeCloudinaryUrl(url, optimizationSettings) : url;
    const originalSize = await getImageSize(url);
    const optimizedSize = await getImageSize(optimizedUrl);

    let suggestedImprovements: string[] = [];
    if (isCloudinary && optimizationSettings.quality < 80) {
      suggestedImprovements.push('Aumentar a qualidade da imagem para pelo menos 80.');
    }
    if (isCloudinary && optimizationSettings.format === 'jpg') {
      suggestedImprovements.push('Usar formato automático ou WebP para melhor compressão.');
    }
    if (!url.includes('w_auto') && !url.includes('dpr_auto')) {
      suggestedImprovements.push('Considerar URLs responsivas para diferentes tamanhos de tela.');
    }

    const analysis: ImageAnalysis = {
      url,
      format: 'desconhecido',
      quality: 'desconhecida',
      width: 'desconhecida',
      height: 'desconhecida',
      isOptimized: optimizedSize < originalSize,
      isResponsive: url.includes('w_auto') || url.includes('dpr_auto'),
      suggestedImprovements,
      estimatedSizeReduction: originalSize - optimizedSize,
    };

    return analysis;
  };

  const getImageSize = (url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'blob';
        request.onload = () => {
          const blob = request.response;
          resolve(blob.size);
        };
        request.onerror = () => reject(new Error(`Erro ao obter o tamanho da imagem: ${url}`));
        request.send();
      };
      img.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${url}`));
      img.src = url;
    });
  };

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results: ImageAnalysis[] = [];

    for (const imageEl of images) {
      try {
        const url = imageEl.src;
        const analysis = await analyzeImage(url);
        results.push(analysis);
      } catch (error: any) {
        console.error(`Erro ao analisar imagem: ${imageEl.src}`, error);
        results.push({
          url: imageEl.src,
          format: 'desconhecido',
          quality: 'desconhecida',
          width: 'desconhecida',
          height: 'desconhecida',
          isOptimized: false,
          isResponsive: false,
          suggestedImprovements: ['Erro ao analisar a imagem.'],
        });
      }
    }

    setAnalysisResults(results);

    const totalImagesRendered = images.length;
    let totalImagesWithIssues = 0;
    let totalDownloadedBytes = 0;
    let detailedIssues: ImageDiagnosticResult['detailedIssues'] = [];

    for (const imageEl of images) {
      const url = imageEl.src;
      const issues: string[] = [];

      if (!url) {
        totalImagesWithIssues++;
        issues.push('URL da imagem não encontrada.');
      } else {
        const isCloudinary = url.includes('cloudinary.com');
        if (isCloudinary) {
          const optimizedUrl = optimizeCloudinaryUrl(url, optimizationSettings);
          const originalSize = await getImageSize(url);
          const optimizedSize = await getImageSize(optimizedUrl);
          totalDownloadedBytes += optimizedSize;

          if (optimizationSettings.quality < 80) {
            totalImagesWithIssues++;
            issues.push('Qualidade da imagem abaixo do recomendado (80).');
          }
          if (optimizationSettings.format === 'jpg') {
            totalImagesWithIssues++;
            issues.push('Formato da imagem não é otimizado (usar auto ou webp).');
          }
          if (!url.includes('w_auto') && !url.includes('dpr_auto')) {
            totalImagesWithIssues++;
            issues.push('URLs não são responsivas para diferentes tamanhos de tela.');
          }
          if (optimizedSize > originalSize) {
            issues.push('Tamanho da imagem otimizada é maior que a original.');
          }
        } else {
          totalImagesWithIssues++;
          issues.push('Imagem não está hospedada no Cloudinary.');
        }
      }

      if (issues.length > 0) {
        detailedIssues.push({
          url,
          element: imageEl,
          issues,
          dimensions: {
            natural: { width: imageEl.naturalWidth, height: imageEl.naturalHeight },
            display: { width: imageEl.width, height: imageEl.height }
          }
        });
      }
    }

    const estimatedPerformanceImpact = totalImagesWithIssues > 0 ? 'Alto' : 'Baixo';

    setDiagnosticResult({
      summary: {
        totalImagesRendered,
        totalImagesWithIssues,
        totalDownloadedBytes,
        estimatedPerformanceImpact,
      },
      detailedIssues,
    });

    setIsLoading(false);
  };

  const optimizeImageUrl = async (url: string) => {
    if (!url) return;

    const isCloudinary = url.includes('cloudinary.com');
    if (!isCloudinary) {
      toast({
        title: "Erro",
        description: "A URL não é do Cloudinary.",
        variant: "destructive",
      });
      return;
    }

    try {
      const optimizedUrl = optimizeCloudinaryUrl(url, optimizationSettings);
      const responsiveSources = getResponsiveImageSources(url, [320, 640, 960, 1280]);
      
      // Create a temporary image element to apply the optimized URL
      const imageEl = new Image();
      imageEl.src = optimizedUrl;
      imageEl.srcset = responsiveSources.srcSet;
      imageEl.sizes = responsiveSources.sizes;

      // Copy the optimized URL to the clipboard
      await navigator.clipboard.writeText(imageEl.src);
      toast({
        title: "Sucesso",
        description: "URL otimizada copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível otimizar e copiar a URL.",
        variant: "destructive",
      });
    }
  };

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-100 bg-opacity-75 z-50 overflow-auto">
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4">Image Diagnostic Debugger</h2>

          {/* Optimization Settings */}
          <div className="mb-4 p-4 bg-white rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Optimization Settings</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="quality">Quality ({optimizationSettings.quality})</Label>
                <Slider
                  id="quality"
                  defaultValue={[optimizationSettings.quality]}
                  max={100}
                  step={5}
                  onValueChange={(value) => setOptimizationSettings({ ...optimizationSettings, quality: value[0] })}
                />
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <select
                  id="format"
                  className="w-full p-2 border rounded"
                  value={optimizationSettings.format}
                  onChange={(e) => setOptimizationSettings({ ...optimizationSettings, format: e.target.value })}
                >
                  <option value="auto">Auto</option>
                  <option value="webp">WebP</option>
                  <option value="jpg">JPG</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="responsive"
                  checked={optimizationSettings.responsive}
                  onCheckedChange={(checked) => setOptimizationSettings({ ...optimizationSettings, responsive: checked })}
                />
                <Label htmlFor="responsive">Generate Responsive Images</Label>
              </div>
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="mb-4 p-4 bg-white rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">Optimize Custom URL</h3>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="Enter image URL"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <Button onClick={() => optimizeImageUrl(customUrl)} disabled={!customUrl}>
                Optimize & Copy
              </Button>
            </div>
          </div>

          {/* Run Diagnostics Button */}
          <Button onClick={runDiagnostics} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              "Executar Diagnóstico"
            )}
          </Button>

          {/* Diagnostic Summary */}
          {diagnosticResult && (
            <div className="mt-4 p-4 bg-white rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Diagnostic Summary</h3>
              <p>Total Images Rendered: {diagnosticResult.summary.totalImagesRendered}</p>
              <p>Total Images with Issues: {diagnosticResult.summary.totalImagesWithIssues}</p>
              <p>Total Downloaded Bytes: {diagnosticResult.summary.totalDownloadedBytes}</p>
              <p>Estimated Performance Impact: {diagnosticResult.summary.estimatedPerformanceImpact}</p>
            </div>
          )}

          {/* Detailed Issues */}
          {diagnosticResult && diagnosticResult.detailedIssues.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded shadow-md">
              <h3 className="text-lg font-semibold mb-2">Detailed Issues</h3>
              {diagnosticResult.detailedIssues.map((issue, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <p>
                    <strong>URL:</strong> {issue.url}
                  </p>
                  <p>
                    <strong>Natural Dimensions:</strong> {issue.dimensions?.natural.width}x{issue.dimensions?.natural.height}
                  </p>
                  <p>
                    <strong>Display Dimensions:</strong> {issue.dimensions?.display.width}x{issue.dimensions?.display.height}
                  </p>
                  {issue.issues.map((error, i) => (
                    <p key={i} className="text-red-500">
                      <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                      {error}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Image List and Analysis */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Image Analysis</h3>
            {isLoading ? (
              <p>Loading images...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="bg-white rounded shadow-md p-4">
                    <img src={img.src} alt={`Image ${index}`} className="mb-2 rounded" style={{ maxWidth: '100%', height: 'auto' }} />
                    <p className="text-sm">
                      <strong>URL:</strong> {img.src}
                    </p>
                    {analysisResults[index] && (
                      <>
                        <p className="text-sm">
                          <strong>Optimized:</strong> {analysisResults[index].isOptimized ? <CheckCircle className="inline-block h-4 w-4 text-green-500" /> : <AlertTriangle className="inline-block h-4 w-4 text-red-500" />}
                        </p>
                        <p className="text-sm">
                          <strong>Responsive:</strong> {analysisResults[index].isResponsive ? <CheckCircle className="inline-block h-4 w-4 text-green-500" /> : <AlertTriangle className="inline-block h-4 w-4 text-red-500" />}
                        </p>
                        {analysisResults[index].suggestedImprovements.length > 0 && (
                          <>
                            <p className="text-sm font-medium">Suggested Improvements:</p>
                            <ul className="list-disc list-inside text-sm text-red-500">
                              {analysisResults[index].suggestedImprovements.map((improvement, i) => (
                                <li key={i}>{improvement}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ImageDiagnosticDebugger;
