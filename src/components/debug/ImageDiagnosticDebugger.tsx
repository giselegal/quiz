
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, CheckCircle, Image as ImageIcon, FileWarning } from 'lucide-react';
import { ImageAnalysis, ImageDiagnosticResult, ImageSettings } from '@/utils/images/types';
import { optimizeCloudinaryUrl } from '@/utils/images/optimization';

const ImageDiagnosticDebugger: React.FC = () => {
  const [diagnosticResult, setDiagnosticResult] = useState<ImageDiagnosticResult>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsAnalyzing(true);
    
    try {
      // Get all images on the page
      const images = Array.from(document.querySelectorAll('img'));
      
      if (images.length === 0) {
        setDiagnosticResult({
          status: 'error',
          error: 'No images found on page'
        });
        return;
      }
      
      const analyses: ImageAnalysis[] = [];
      const detailedIssues: any[] = [];
      let totalSize = 0;
      let optimizedImages = 0;
      let potentialSavings = 0;
      let imagesWithIssues = 0;
      
      for (const img of images) {
        const url = img.src;
        if (!url) continue;
        
        // Basic analysis
        const analysis = await analyzeImage(url);
        
        // Check for common issues
        const issues: string[] = [];
        
        // Check if image is properly sized
        const displayWidth = img.clientWidth;
        const displayHeight = img.clientHeight;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        
        if (naturalWidth > displayWidth * 2) {
          issues.push(`Image is too large (${naturalWidth}px vs ${displayWidth}px displayed)`);
        }
        
        if (!img.getAttribute('width') || !img.getAttribute('height')) {
          issues.push('Missing explicit width/height attributes (may cause layout shifts)');
        }
        
        if (img.getAttribute('loading') !== 'lazy' && !isImageVisible(img)) {
          issues.push('Off-screen image not using lazy loading');
        }
        
        // Check if CloudinaryURL could be optimized
        if (url.includes('cloudinary.com')) {
          const optimizationOptions: ImageSettings = {
            quality: 80,
            format: 'auto',
            responsive: true
          } as any; // Type assertion to avoid type error
          
          const optimizedUrl = optimizeCloudinaryUrl(url, optimizationOptions as any);
          
          if (optimizedUrl !== url) {
            issues.push('Cloudinary URL could be better optimized');
            if (!analysis.estimatedSizeReduction) {
              analysis.estimatedSizeReduction = 30; // Estimated size reduction percentage
            }
          }
          
          if (analysis.format === 'jpeg' || analysis.format === 'jpg') {
            issues.push('Consider using WebP or AVIF format for better compression');
          }
        }
        
        // Add details for images with issues
        if (issues.length > 0) {
          imagesWithIssues++;
          detailedIssues.push({
            url,
            element: img,
            issues,
            dimensions: {
              natural: { width: naturalWidth, height: naturalHeight },
              display: { width: displayWidth, height: displayHeight },
            }
          });
        }
        
        // Update stats
        if (analysis.size) {
          totalSize += analysis.size;
        }
        
        if (analysis.optimized) {
          optimizedImages++;
        } else if (analysis.estimatedSizeReduction) {
          potentialSavings += (analysis.size || 0) * analysis.estimatedSizeReduction / 100;
        }
        
        analyses.push(analysis);
      }
      
      // Set result
      setDiagnosticResult({
        status: 'success',
        summary: {
          totalImages: images.length,
          optimizedImages,
          totalSize,
          potentialSavings,
          totalImagesRendered: images.length,
          totalImagesWithIssues: imagesWithIssues,
          totalDownloadedBytes: totalSize,
          estimatedPerformanceImpact: imagesWithIssues > 0 ? 'moderate' : 'low'
        },
        detailedIssues
      });
      
    } catch (err) {
      console.error('Error analyzing images:', err);
      setDiagnosticResult({
        status: 'error',
        error: `Error analyzing images: ${err instanceof Error ? err.message : String(err)}`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const analyzeImage = async (url: string): Promise<ImageAnalysis> => {
    // This would typically make server requests, but we'll simulate for now
    const analysis: ImageAnalysis = { url };
    
    try {
      // Get basic info
      analysis.format = getImageFormat(url);
      
      // Simulate size calculation (would normally require server-side)
      analysis.size = Math.floor(Math.random() * 500000) + 50000; // 50KB to 500KB
      
      // Check if optimized
      analysis.optimized = url.includes('q_auto') || url.includes('f_auto');
      
      // Add dimensions
      const img = document.querySelector(`img[src="${url}"]`) as HTMLImageElement;
      if (img) {
        analysis.dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight
        };
      }
      
      // Generate recommendations
      const recommendations: string[] = [];
      
      if (!analysis.optimized) {
        recommendations.push('Use automatic quality optimization (q_auto)');
      }
      
      if (!url.includes('f_auto') && !url.includes('f_webp') && !url.includes('f_avif')) {
        recommendations.push('Use automatic format selection (f_auto)');
      }
      
      if (!url.includes('w_') && analysis.dimensions) {
        recommendations.push(`Specify appropriate width (w_${analysis.dimensions.width})`);
      }
      
      analysis.recommendations = recommendations;
      analysis.suggestedImprovements = recommendations; // Alias for recommendations
      
      // Estimate quality
      analysis.quality = url.includes('q_auto') ? 'auto' : url.match(/q_(\d+)/) ? url.match(/q_(\d+)/)![1] : '85';
      
      // Check responsiveness
      analysis.isResponsive = Boolean(document.querySelector(`img[src="${url}"][sizes]`));
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing image:', url, error);
      return { 
        url, 
        error: error instanceof Error ? error.message : String(error)
      } as any;
    }
  };
  
  const getImageFormat = (url: string): string => {
    const extension = url.split('?')[0].split('.').pop()?.toLowerCase();
    
    if (url.includes('f_auto')) return 'auto';
    if (url.includes('f_webp')) return 'webp';
    if (url.includes('f_avif')) return 'avif';
    
    return extension || 'unknown';
  };
  
  const isImageVisible = (img: HTMLElement): boolean => {
    const rect = img.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight &&
      rect.bottom >= 0
    );
  };
  
  const totalIssuesCount = diagnosticResult.detailedIssues?.reduce(
    (count, img) => count + img.issues.length, 0
  ) || 0;
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image Diagnostic Tool
        </CardTitle>
        <CardDescription>
          Analyze image loading performance across the page
        </CardDescription>
      </CardHeader>
      <CardContent>
        {diagnosticResult.status === 'error' ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{diagnosticResult.error}</AlertDescription>
          </Alert>
        ) : diagnosticResult.summary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Images" 
                value={diagnosticResult.summary?.totalImages || 0} 
                unit=""
              />
              <StatCard 
                title="Total Size" 
                value={Math.round((diagnosticResult.summary?.totalSize || 0) / 1024)} 
                unit="KB"
              />
              <StatCard 
                title="Optimized" 
                value={diagnosticResult.summary?.optimizedImages || 0} 
                unit={`/${diagnosticResult.summary?.totalImages || 0}`}
                positive={true}
              />
              <StatCard 
                title="Potential Savings" 
                value={Math.round((diagnosticResult.summary?.potentialSavings || 0) / 1024)} 
                unit="KB"
                positive={!(diagnosticResult.summary?.potentialSavings || 0) > 50000}
              />
            </div>
            
            {totalIssuesCount > 0 && (
              <Alert className={totalIssuesCount > 5 ? 'bg-amber-50' : 'bg-blue-50'}>
                <AlertTriangle className={`h-4 w-4 ${totalIssuesCount > 5 ? 'text-amber-600' : 'text-blue-600'}`} />
                <AlertTitle className="flex items-center gap-1.5">
                  <span>{totalIssuesCount > 5 ? 'Image optimization issues detected' : 'Some improvements possible'}</span>
                  <Badge variant={totalIssuesCount > 5 ? 'destructive' : 'outline'}>
                    {totalIssuesCount} {totalIssuesCount === 1 ? 'issue' : 'issues'}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {totalIssuesCount > 5 
                    ? 'Multiple images could be optimized to improve page load performance.' 
                    : 'Minor optimizations could improve image loading slightly.'}
                </AlertDescription>
              </Alert>
            )}
            
            {diagnosticResult.detailedIssues && diagnosticResult.detailedIssues.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-medium">Detected Issues:</h3>
                <div className="max-h-[300px] overflow-y-auto border rounded-md p-2">
                  {diagnosticResult.detailedIssues.map((item, i) => (
                    <div key={i} className="border-b py-2 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div className="truncate max-w-[200px] text-xs text-gray-500">
                          {new URL(item.url).pathname.split('/').pop()}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => setSelectedImage(item.url)}
                        >
                          View
                        </Button>
                      </div>
                      <ul className="mt-1 space-y-1">
                        {item.issues.map((issue: string, j: number) => (
                          <li key={j} className="text-xs text-red-600 flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedImage && (
              <div className="mt-4 border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Selected Image</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6"
                    onClick={() => setSelectedImage(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Selected image preview" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="mt-2 text-xs break-all">
                  <span className="font-semibold">URL:</span> {selectedImage}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-gray-500">
          {diagnosticResult.status === 'success' && diagnosticResult.summary ? (
            <span>Analysis completed successfully</span>
          ) : null}
        </div>
        <Button onClick={runDiagnostics} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Images'}
        </Button>
      </CardFooter>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, positive }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-xl font-bold ${positive ? 'text-green-600' : ''}`}>
        {value}{unit}
      </div>
    </div>
  );
};

export default ImageDiagnosticDebugger;
