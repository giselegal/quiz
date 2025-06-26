import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface DropZoneProps {
  isActive: boolean
  onDrop: () => void
  className?: string
}

export const DropZone: React.FC<DropZoneProps> = ({ isActive, onDrop, className = '' }) => {
  return (
    <motion.div 
      className={`transition-all duration-200 ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-500 rounded-lg p-4' 
          : 'border-2 border-transparent p-4'
      } ${className}`}
      animate={isActive ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isActive && (
        <motion.div 
          className="text-center text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm font-medium">Solte o componente aqui</p>
        </motion.div>
      )}
    </motion.div>
  )
}