import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageDiagnosticDebuggerProps {
  imageUrl?: string;
}

export const ImageDiagnosticDebugger: React.FC<ImageDiagnosticDebuggerProps> = ({ imageUrl }) => {
  const [path, setPath] = useState(imageUrl || '/og.png');
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'auto' | 'webp' | 'avif'>('auto');
  const [responsive, setResponsive] = useState(true);
  const [debug, setDebug] = useState(false);
  const [eager, setEager] = useState(false);
  const [raw, setRaw] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [sizes, setSizes] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<'lazy' | 'eager' | undefined>(undefined);
  const [unoptimized, setUnoptimized] = useState(false);
  const [priority, setPriority] = useState(false);
  const [fill, setFill] = useState(false);
  const [customParams, setCustomParams] = useState('');
  const [showOriginal, setShowOriginal] = useState(false);
  const [showTransformed, setShowTransformed] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [placeholderType, setPlaceholderType] = useState<'blur' | 'empty'>('blur');
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);
  const [onLoadingCompleteCalled, setOnLoadingCompleteCalled] = useState(false);
  const [onErrorCalled, setOnErrorCalled] = useState(false);
  const [onLoadCalled, setOnLoadCalled] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Define valid formats as a type
  type FormatType = 'auto' | 'webp' | 'avif';

  // Update the optimization settings with proper typing
  const optimizationSettings = {
    quality: 80,
    format: 'auto' as FormatType,
    responsive: true,
  };

  const getImageUrl = (path: string, settings: { quality: number; format: FormatType; responsive: boolean }) => {
    let url = path;
    const params = [];

    if (settings.quality) {
      params.push(`q_${settings.quality}`);
    }
    if (settings.format && settings.format !== 'auto') {
      params.push(`f_${settings.format}`);
    }
    if (settings.responsive) {
      params.push('w_auto');
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return url;
  };

  const transformedImageUrl = getImageUrl(path, { quality, format, responsive });

  const handleReset = () => {
    setPath(imageUrl || '/og.png');
    setQuality(80);
    setFormat('auto');
    setResponsive(true);
    setDebug(false);
    setEager(false);
    setRaw(false);
    setWidth(undefined);
    setHeight(undefined);
    setSizes(undefined);
    setLoading(undefined);
    setUnoptimized(false);
    setPriority(false);
    setFill(false);
    setCustomParams('');
    setShowOriginal(false);
    setShowTransformed(true);
    setShowSettings(true);
    setShowAdvancedSettings(false);
    setShowPlaceholder(true);
    setPlaceholderType('blur');
    setBlurDataURL(undefined);
    setOnLoadingCompleteCalled(false);
    setOnErrorCalled(false);
    setOnLoadCalled(false);
    setImageKey(prevKey => prevKey + 1);
  };

  const handleImageLoad = useCallback(() => {
    setOnLoadCalled(true);
    toast({
      title: "Image Loaded",
      description: "onLoad event was triggered.",
    });
  }, []);

  const handleImageError = useCallback(() => {
    setOnErrorCalled(true);
    toast({
      title: "Image Error",
      description: "onError event was triggered.",
      variant: "destructive",
    });
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setOnLoadingCompleteCalled(true);
    toast({
      title: "Loading Complete",
      description: "onLoadingComplete event was triggered.",
    });
  }, []);

  // Fix for CheckedState handling
  const handleShowPlaceholderChange = (checked: boolean) => {
    setShowPlaceholder(checked);
  };

  const handlePlaceholderTypeChange = (value: 'blur' | 'empty') => {
    setPlaceholderType(value);
  };

  const renderPlaceholder = () => {
    if (!showPlaceholder) return undefined;

    if (placeholderType === 'blur') {
      return 'blur';
    } else {
      return 'empty';
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 p-4">
      {/* Settings Panel */}
      {showSettings && (
        <Card className="w-full md:w-1/3">
          <CardContent className="space-y-4">
            <h2 className="text-lg font-semibold">Image Settings</h2>

            <div className="space-y-2">
              <Label htmlFor="imagePath">Image Path</Label>
              <Input
                id="imagePath"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="Enter image path"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageQuality">Quality (0-100)</Label>
              <Input
                id="imageQuality"
                type="number"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                placeholder="Enter quality"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageFormat">Format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as FormatType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="avif">AVIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="imageResponsive" checked={responsive} onCheckedChange={(value) => setResponsive(!!value)} />
              <Label htmlFor="imageResponsive">Responsive</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="showOriginal" checked={showOriginal} onCheckedChange={setShowOriginal} />
              <Label htmlFor="showOriginal">Show Original</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="showTransformed" checked={showTransformed} onCheckedChange={setShowTransformed} />
              <Label htmlFor="showTransformed">Show Transformed</Label>
            </div>

            <Button onClick={handleReset} variant="outline">Reset</Button>

            <Button onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
              {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </Button>

            {showAdvancedSettings && (
              <div className="mt-4 space-y-4 border rounded p-4">
                <h3 className="text-md font-semibold">Advanced Settings</h3>

                <div className="flex items-center space-x-2">
                  <Switch id="imageDebug" checked={debug} onCheckedChange={setDebug} />
                  <Label htmlFor="imageDebug">Debug</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="imageEager" checked={eager} onCheckedChange={setEager} />
                  <Label htmlFor="imageEager">Eager</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="imageRaw" checked={raw} onCheckedChange={setRaw} />
                  <Label htmlFor="imageRaw">Raw</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageWidth">Width</Label>
                  <Input
                    id="imageWidth"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    placeholder="Enter width"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageHeight">Height</Label>
                  <Input
                    id="imageHeight"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    placeholder="Enter height"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageSizes">Sizes</Label>
                  <Input
                    id="imageSizes"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="Enter sizes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageLoading">Loading</Label>
                  <Select value={loading} onValueChange={(value) => setLoading(value as 'lazy' | 'eager')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select loading" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lazy">Lazy</SelectItem>
                      <SelectItem value="eager">Eager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="imageUnoptimized" checked={unoptimized} onCheckedChange={setUnoptimized} />
                  <Label htmlFor="imageUnoptimized">Unoptimized</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="imagePriority" checked={priority} onCheckedChange={setPriority} />
                  <Label htmlFor="imagePriority">Priority</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="imageFill" checked={fill} onCheckedChange={setFill} />
                  <Label htmlFor="imageFill">Fill</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageCustomParams">Custom Parameters</Label>
                  <Input
                    id="imageCustomParams"
                    value={customParams}
                    onChange={(e) => setCustomParams(e.target.value)}
                    placeholder="Enter custom parameters"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showPlaceholder"
                      checked={showPlaceholder}
                      onCheckedChange={handleShowPlaceholderChange}
                    />
                    <Label htmlFor="showPlaceholder">Show Placeholder</Label>
                  </div>
                  {showPlaceholder && (
                    <div className="ml-4">
                      <Label htmlFor="placeholderType">Placeholder Type</Label>
                      <Select value={placeholderType} onValueChange={(value) => handlePlaceholderTypeChange(value as 'blur' | 'empty')}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select placeholder type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blur">Blur</SelectItem>
                          <SelectItem value="empty">Empty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Image Display */}
      <div className="w-full md:w-2/3 flex flex-col space-y-4">
        {showOriginal && (
          <div className="border rounded p-4">
            <h3 className="text-md font-semibold">Original Image</h3>
            <img
              key={imageKey}
              src={path}
              alt="Original"
              style={{ maxWidth: '100%', height: 'auto' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}

        {showTransformed && (
          <div className="border rounded p-4">
            <h3 className="text-md font-semibold">Transformed Image</h3>
            <img
              key={imageKey + 1}
              src={transformedImageUrl}
              alt="Transformed"
              style={{ maxWidth: '100%', height: 'auto' }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        )}
      </div>
    </div>
  );
};
