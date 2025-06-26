
import React from 'react';
import { Block } from '@/types/editor';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ResponsivePropertiesEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

interface ResponsiveContent {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobileWidth?: string;
  tabletWidth?: string;
}

export function ResponsivePropertiesEditor({ block, onUpdate }: ResponsivePropertiesEditorProps) {
  const blockContent = (block.content || {}) as ResponsiveContent;

  const handleContentUpdate = (updates: Partial<ResponsiveContent>) => {
    const currentContent = blockContent;
    const newContent = { ...currentContent, ...updates };
    onUpdate(newContent);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#432818]">Visibilidade</h3>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="hideOnMobile" className="text-sm">Ocultar no mobile</Label>
          <Switch
            id="hideOnMobile"
            checked={blockContent.hideOnMobile || false}
            onCheckedChange={(checked) => handleContentUpdate({ hideOnMobile: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="hideOnTablet" className="text-sm">Ocultar no tablet</Label>
          <Switch
            id="hideOnTablet"
            checked={blockContent.hideOnTablet || false}
            onCheckedChange={(checked) => handleContentUpdate({ hideOnTablet: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="hideOnDesktop" className="text-sm">Ocultar no desktop</Label>
          <Switch
            id="hideOnDesktop"
            checked={blockContent.hideOnDesktop || false}
            onCheckedChange={(checked) => handleContentUpdate({ hideOnDesktop: checked })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#432818]">Largura responsiva</h3>
        
        <div className="space-y-2">
          <Label htmlFor="mobileWidth" className="text-sm">Largura no mobile</Label>
          <Select 
            value={blockContent.mobileWidth || 'full'}
            onValueChange={(value) => handleContentUpdate({ mobileWidth: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">100%</SelectItem>
              <SelectItem value="3/4">75%</SelectItem>
              <SelectItem value="1/2">50%</SelectItem>
              <SelectItem value="1/3">33%</SelectItem>
              <SelectItem value="1/4">25%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tabletWidth" className="text-sm">Largura no tablet</Label>
          <Select 
            value={blockContent.tabletWidth || 'full'}
            onValueChange={(value) => handleContentUpdate({ tabletWidth: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">100%</SelectItem>
              <SelectItem value="3/4">75%</SelectItem>
              <SelectItem value="1/2">50%</SelectItem>
              <SelectItem value="1/3">33%</SelectItem>
              <SelectItem value="1/4">25%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
