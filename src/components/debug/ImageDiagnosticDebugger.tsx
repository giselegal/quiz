import React, { useState, useEffect, useCallback } from 'react';
import {
  ImageAnalysis,
  ImageDiagnosticResult,
  PreloadImageDefinition
} from '@/utils/images/types';
import {
  getOptimizedImage,
  getLowQualityPlaceholder,
  getResponsiveImageSources,
  getImageMetadata
} from '@/utils/imageManager';
import { optimizeCloudinaryUrl } from '@/utils/imageUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from '@/components/ui/use-toast';
import { getLowQualityImage } from '@/utils/imageManager';

interface ImageDiagnosticDebuggerProps {
  imageUrl: string;
}

const ImageDiagnosticDebugger: React.FC<ImageDiagnosticDebuggerProps> = ({ imageUrl }) => {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string>(imageUrl);
  const [lqipUrl, setLqipUrl] = useState<string>('');
  const [responsiveSrcSet, setResponsiveSrcSet] = useState<string>('');
  const [responsiveSizes, setResponsiveSizes] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [format, setFormat] = useState<'auto' | 'webp' | 'jpg' | 'png'>('auto');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [isLqipGenerating, setIsLqipGenerating] = useState<boolean>(false);
  const [isResponsiveGenerating, setIsResponsiveGenerating] = useState<boolean>(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isLowQualityGenerating, setIsLowQualityGenerating] = useState<boolean>(false);
  const [lowQualityImage, setLowQualityImage] = useState<string>('');
  const [isCopyingOptimized, setIsCopyingOptimized] = useState<boolean>(false);
  const [isCopyingLqip, setIsCopyingLqip] = useState<boolean>(false);
  const [isCopyingResponsive, setIsCopyingResponsive] = useState<boolean>(false);
  const [isCopyingLowQuality, setIsCopyingLowQuality] = useState<boolean>(false);
  const [isCopiedOptimized, setIsCopiedOptimized] = useState<boolean>(false);
  const [isCopiedLqip, setIsCopiedLqip] = useState<boolean>(false);
  const [isCopiedResponsive, setIsCopiedResponsive] = useState<boolean>(false);
  const [isCopiedLowQuality, setIsCopiedLowQuality] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [totalImages, setTotalImages] = useState<number>(0);
  const [totalIssues, setTotalIssues] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const { toast } = useToast();

  // Reset copied state after a delay
  useEffect(() => {
    if (isCopiedOptimized) {
      const timer = setTimeout(() => setIsCopiedOptimized(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopiedOptimized]);

  useEffect(() => {
    if (isCopiedLqip) {
      const timer = setTimeout(() => setIsCopiedLqip(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopiedLqip]);

  useEffect(() => {
    if (isCopiedResponsive) {
      const timer = setTimeout(() => setIsCopiedResponsive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopiedResponsive]);

  useEffect(() => {
    if (isCopiedLowQuality) {
      const timer = setTimeout(() => setIsCopiedLowQuality(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopiedLowQuality]);

  // Analyze image function
  const analyzeImage = useCallback(async () => {
    setIsAnalyzing(true);
    setIsError(false);
    setErrorMessage('');

    try {
      // Simulate analysis with dummy data
      const dummyAnalysis: ImageAnalysis = {
        url: imageUrl,
        format: 'auto',
        quality: '80',
        width: 'auto',
        height: 'auto',
        isOptimized: false,
        isResponsive: false,
        suggestedImprovements: ['Optimize image', 'Use responsive images'],
        estimatedSizeReduction: 0.5
      };

      setAnalysis(dummyAnalysis);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageUrl]);

  // Optimize image function
  const optimizeImage = useCallback(() => {
    setIsOptimizing(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const optimized = optimizeCloudinaryUrl(imageUrl, { quality, format, width, height });
      setOptimizedUrl(optimized);
    } catch (error: any) {
      console.error('Error optimizing image:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to optimize image');
    } finally {
      setIsOptimizing(false);
    }
  }, [imageUrl, quality, format, width, height]);

  // Generate LQIP function
  const generateLQIP = useCallback(async () => {
    setIsLqipGenerating(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const lqip = getLowQualityPlaceholder(imageUrl, { quality: 20, width: 30 });
      setLqipUrl(lqip);
    } catch (error: any) {
      console.error('Error generating LQIP:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to generate LQIP');
    } finally {
      setIsLqipGenerating(false);
    }
  }, [imageUrl]);

  // Generate responsive images function
  const generateResponsiveImages = useCallback(() => {
    setIsResponsiveGenerating(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const responsive = getResponsiveImageSources(imageUrl);
      setResponsiveSrcSet(responsive.srcSet);
      setResponsiveSizes(responsive.sizes);
    } catch (error: any) {
      console.error('Error generating responsive images:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to generate responsive images');
    } finally {
      setIsResponsiveGenerating(false);
    }
  }, [imageUrl]);

  // Load image metadata function
  const loadImageMetadata = useCallback(async () => {
    setIsMetadataLoading(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const meta = await getImageMetadata(imageUrl);
      setMetadata(meta);
    } catch (error: any) {
      console.error('Error loading image metadata:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to load image metadata');
    } finally {
      setIsMetadataLoading(false);
    }
  }, [imageUrl]);

  // Generate low quality image function
  const generateLowQualityImage = useCallback(async () => {
    setIsLowQualityGenerating(true);
    setIsError(false);
    setErrorMessage('');

    try {
      const lowQuality = await getLowQualityImage(imageUrl);
      setLowQualityImage(lowQuality);
    } catch (error: any) {
      console.error('Error generating low quality image:', error);
      setIsError(true);
      setErrorMessage(error.message || 'Failed to generate low quality image');
    } finally {
      setIsLowQualityGenerating(false);
    }
  }, [imageUrl]);

  // Copy to clipboard functions
  const copyToClipboard = (text: string, setState: (value: boolean) => void, setCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setState(true);
        setCopiedState(true);
        toast({
          title: "Copiado para a área de transferência!",
          description: "Cole o código onde precisar.",
        })
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setState(false);
        setCopiedState(false);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código. Tente novamente.",
          variant: "destructive",
        })
      });
  };

  // Image diagnostic function (dummy implementation)
  const runImageDiagnostics = useCallback(async () => {
    // Dummy data for demonstration
    const dummyResult: ImageDiagnosticResult = {
      summary: {
        totalImagesRendered: 10,
        totalImagesWithIssues: 3,
        totalDownloadedBytes: 500000,
        estimatedPerformanceImpact: 'Medium'
      },
      detailedIssues: [
        {
          url: imageUrl,
          element: document.createElement('img'),
          issues: ['Large image size', 'Missing alt text'],
          dimensions: {
            natural: { width: 1920, height: 1080 },
            display: { width: 640, height: 360 }
          }
        }
      ]
    };

    // Extract relevant data for display
    const { summary } = dummyResult;
    const { totalImagesRendered, totalImagesWithIssues, totalDownloadedBytes } = summary;

    setTotalImages(totalImagesRendered);
    setTotalIssues(totalImagesWithIssues);
    setTotalSize(totalDownloadedBytes);
  }, [imageUrl]);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Image Diagnostic Debugger</h2>

      {/* Image Display and Controls */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-1/2">
          <img src={imageUrl} alt="Original" className="max-w-full h-auto rounded-lg shadow-md" />
          <p className="text-sm text-gray-500 mt-2">Original Image</p>
        </div>

        <div className="w-full md:w-1/2">
          <img src={optimizedUrl} alt="Optimized" className="max-w-full h-auto rounded-lg shadow-md" />
          <p className="text-sm text-gray-500 mt-2">Optimized Image</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="quality">Quality:</Label>
            <Slider
              id="quality"
              defaultValue={[quality]}
              max={100}
              step={5}
              onValueChange={(value) => setQuality(value[0])}
              className="max-w-md"
            />
            <span>{quality}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="format">Format:</Label>
            <select
              id="format"
              className="border rounded-md p-1"
              value={format}
              onChange={(e) => setFormat(e.target.value as 'auto' | 'webp' | 'jpg' | 'png')}
            >
              <option value="auto">Auto</option>
              <option value="webp">WebP</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="width">Width:</Label>
            <Input
              type="number"
              id="width"
              className="border rounded-md p-1 w-20"
              value={width === undefined ? '' : width.toString()}
              onChange={(e) => setWidth(e.target.value === '' ? undefined : parseInt(e.target.value))}
              placeholder="Auto"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="height">Height:</Label>
            <Input
              type="number"
              id="height"
              className="border rounded-md p-1 w-20"
              value={height === undefined ? '' : height.toString()}
              onChange={(e) => setHeight(e.target.value === '' ? undefined : parseInt(e.target.value))}
              placeholder="Auto"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={optimizeImage} disabled={isOptimizing}>
            {isOptimizing ? 'Optimizing...' : 'Optimize Image'}
          </Button>
          <Button onClick={generateLQIP} disabled={isLqipGenerating}>
            {isLqipGenerating ? 'Generating LQIP...' : 'Generate LQIP'}
          </Button>
          <Button onClick={generateResponsiveImages} disabled={isResponsiveGenerating}>
            {isResponsiveGenerating ? 'Generating Responsive Images...' : 'Generate Responsive Images'}
          </Button>
          <Button onClick={generateLowQualityImage} disabled={isLowQualityGenerating}>
            {isLowQualityGenerating ? 'Generating Low Quality Image...' : 'Generate Low Quality Image'}
          </Button>
          <Button onClick={loadImageMetadata} disabled={isMetadataLoading}>
            {isMetadataLoading ? 'Loading Metadata...' : 'Load Image Metadata'}
          </Button>
          <Button onClick={analyzeImage} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
          </Button>
          <Button onClick={runImageDiagnostics}>
            Run Image Diagnostics
          </Button>
        </div>
      </div>

      {/* Results */}
      {analysis && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Analysis Results</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}

      {metadata && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Image Metadata</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}

      {optimizedUrl !== imageUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Optimized URL</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              readOnly
              value={optimizedUrl}
              className="flex-grow"
            />
            <Button
              variant="outline"
              disabled={isCopyingOptimized}
              onClick={() => copyToClipboard(optimizedUrl, setIsCopyingOptimized, setIsCopiedOptimized)}
            >
              {isCopiedOptimized ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopyingOptimized ? 'Copying...' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      {lqipUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">LQIP URL</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              readOnly
              value={lqipUrl}
              className="flex-grow"
            />
            <Button
              variant="outline"
              disabled={isCopyingLqip}
              onClick={() => copyToClipboard(lqipUrl, setIsCopyingLqip, setIsCopiedLqip)}
            >
              {isCopiedLqip ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopyingLqip ? 'Copying...' : 'Copy'}
            </Button>
          </div>
          <img src={lqipUrl} alt="LQIP" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      )}

      {responsiveSrcSet && responsiveSizes && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Responsive Images</h3>
          <div className="space-y-2">
            <div>
              <Label>SrcSet:</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  readOnly
                  value={responsiveSrcSet}
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  disabled={isCopyingResponsive}
                  onClick={() => copyToClipboard(responsiveSrcSet, setIsCopyingResponsive, setIsCopiedResponsive)}
                >
                  {isCopiedResponsive ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {isCopyingResponsive ? 'Copying...' : 'Copy'}
                </Button>
              </div>
            </div>
            <div>
              <Label>Sizes:</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  readOnly
                  value={responsiveSizes}
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  disabled={isCopyingResponsive}
                  onClick={() => copyToClipboard(responsiveSizes, setIsCopyingResponsive, setIsCopiedResponsive)}
                >
                  {isCopiedResponsive ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {isCopyingResponsive ? 'Copying...' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lowQualityImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Low Quality Image</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              readOnly
              value={lowQualityImage}
              className="flex-grow"
            />
            <Button
              variant="outline"
              disabled={isCopyingLowQuality}
              onClick={() => copyToClipboard(lowQualityImage, setIsCopyingLowQuality, setIsCopiedLowQuality)}
            >
              {isCopiedLowQuality ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopyingLowQuality ? 'Copying...' : 'Copy'}
            </Button>
          </div>
          <img src={lowQualityImage} alt="Low Quality" className="max-w-full h-auto rounded-lg shadow-md" />
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Image Diagnostics Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Image Diagnostics Summary</h3>
        <Table>
          <TableCaption>Summary of image diagnostics results.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Total Images Rendered</TableCell>
              <TableCell>{(totalImages as React.ReactNode)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Images with Issues</TableCell>
              <TableCell>{(totalIssues as React.ReactNode)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Downloaded Bytes</TableCell>
              <TableCell>{(totalSize as React.ReactNode)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ImageDiagnosticDebugger;
