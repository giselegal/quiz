import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Save, Eye, Upload, Loader2 } from 'lucide-react'

interface MobileNavbarProps {
  onMenuClick: () => void
  onSave: () => void
  onPreview: () => void
  onPublish: () => void
  isSaving?: boolean
  isPublishing?: boolean
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  onMenuClick,
  onSave,
  onPreview,
  onPublish,
  isSaving = false,
  isPublishing = false
}) => {
  return (
    <header className="h-16 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 px-4 flex items-center justify-between md:hidden">
      {/* Left */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="text-zinc-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-white">CaktoQuiz</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="text-zinc-400 hover:text-white p-2"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isSaving}
          onClick={onSave}
          className="text-zinc-400 hover:text-white p-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          disabled={isPublishing}
          onClick={onPublish}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3"
        >
          {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  )
}